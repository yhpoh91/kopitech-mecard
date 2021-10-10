const express = require('express');
const VCard = require('vcard-creator').default;

const { L } = require('kopitech-logger')('Global Router');

const router = express.Router({ mergeParams: true });

const getData = (mecardId) => {
  const idInsert = (mecardId ? `${mecardId}_` : '').toUpperCase();
  return {
    mecard: {
      id: mecardId,
      url: `${process.env.HOST}/${mecardId}/manifest.json`,
    },
    vcard: {
      url: `${process.env.HOST}/${mecardId}/vcard`,
    },
    personal: {
      firstName: process.env[`MECARD_${idInsert}PERSONAL_FIRST_NAME`],
      lastName: process.env[`MECARD_${idInsert}PERSONAL_LAST_NAME`],
    },

    contact: {
      email: process.env[`MECARD_${idInsert}CONTACT_EMAIL`],
      phoneNumber: process.env[`MECARD_${idInsert}CONTACT_PHONE_NUMBER`],
      wechat: (process.env[`MECARD_${idInsert}CONTACT_WECHAT_ENABLED`] || 'true') === 'true' && {
        handle: process.env[`MECARD_${idInsert}CONTACT_WECHAT_HANDLE`],
        url: `weixin://dl/profile/${process.env[`MECARD_${idInsert}CONTACT_WECHAT_HANDLE`]}`,
      },
      
      linkedIn: (process.env[`MECARD_${idInsert}CONTACT_LINKEDIN_ENABLED`] || 'true') === 'true' && {
        handle: `@${process.env[`MECARD_${idInsert}CONTACT_LINKEDIN_HANDLE`]}`,
        url: `https://linkedin.com/in/${process.env[`MECARD_${idInsert}CONTACT_LINKEDIN_HANDLE`]}`,
      },
      
      github: (process.env[`MECARD_${idInsert}CONTACT_GITHUB_ENABLED`] || 'true') === 'true' && {
        handle: `@${process.env[`MECARD_${idInsert}CONTACT_GITHUB_HANDLE`]}`,
        url: `https://github.com/${process.env[`MECARD_${idInsert}CONTACT_GITHUB_HANDLE`]}`,
      },
    },

    career: {
      company: {
        name: process.env[`MECARD_${idInsert}CAREER_COMPANY_NAME`],
        website: process.env[`MECARD_${idInsert}CAREER_COMPANY_WEBSITE`],
      },
      position: process.env[`MECARD_${idInsert}CAREER_POSITION`],
    },
  };
};

const controller = async (req, res, next) => {
  try {
    const { mecardId } = req.params;
    const template = "taby-universal";

    const me = getData(mecardId);
    res.render(template, me);
  } catch (error) {
    L.error(error);
    next(error);
  }
}

const vcardController = async (req, res, next) => {
  try {
    const { mecardId } = req.params;
    const me = getData(mecardId);
    const vcard = new VCard();
    vcard
      .addName(me.personal.lastName, me.personal.firstName)
      .addEmail(me.contact.email)
      .addPhoneNumber(me.contact.phoneNumber)
      .addCompany(me.career.company.name)
      .addJobtitle(me.career.position)
      .addURL(me.contact.linkedIn.url, "HOME")
      .addURL(me.career.company.website, "WORK")

    res.set({
      "Content-Disposition": `attachment; filename=\"${me.personal.firstName}_${me.personal.lastName}_vcard.vcf\"`,
      "Content-Type": "text/vcard"
    });
    res.send(vcard.toString());
  } catch (error) {
    L.error(error);
    next(error);
  }
}

const manifestController = async (req, res, next) => {
  try {
    const { mecardId } = req.params;
    const me = getData(mecardId);
    const manifest = {
      "short_name": "Mecard",
      "name": `Mecard - ${me.personal.firstName} ${me.personal.lastName}`,
      "description": `Kopitech Mecard for ${me.personal.firstName} ${me.personal.lastName}`,
      "icons": [
        {
          "src": "https://storage.googleapis.com/taby-app-media/web/taby-logo-round.png",
          "type": "image/png",
          "sizes": "512x512",
          "purpose": "any maskable",
        }
      ],
      "start_url": `/${me.mecard.id}`,
      "background_color": "#fcc47d",
      "display": "standalone",
      "scope": "/",
      "theme_color": "#fcc47d"
    };

    res.json(manifest);
  } catch (error) {
    L.error(error);
    next(error);
  }
}

router.use(express.static('public'));

router.route('/:mecardId')
  .get(controller);

router.route('/:mecardId/vcard')
  .get(vcardController);

router.route('/:mecardId/manifest.json')
  .get(manifestController);

module.exports = router;
