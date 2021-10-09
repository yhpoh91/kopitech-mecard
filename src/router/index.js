const express = require('express');
const VCard = require('vcard-creator').default;

const { L } = require('kopitech-logger')('Global Router');

const router = express.Router({ mergeParams: true });

const getData = () => ({
  mecard: {
    id: 'yeehuipoh',
    url: `${process.env.HOST}/yeehuipoh/manifest.json`,
  },
  vcard: {
    url: `${process.env.HOST}/yeehuipoh/vcard`,
  },
  personal: {
    firstName: process.env.MECARD_PERSONAL_FIRST_NAME,
    lastName: process.env.MECARD_PERSONAL_LAST_NAME,
  },

  contact: {
    email: process.env.MECARD_CONTACT_EMAIL,
    phoneNumber: process.env.MECARD_CONTACT_PHONE_NUMBER,
    wechat: (process.env.MECARD_CONTACT_WECHAT_ENABLED || 'true') === 'true' && {
      handle: process.env.MECARD_CONTACT_WECHAT_HANDLE,
      url: `weixin://dl/profile/${process.env.MECARD_CONTACT_WECHAT_HANDLE}`,
    },
    
    linkedIn: (process.env.MECARD_CONTACT_LINKEDIN_ENABLED || 'true') === 'true' && {
      handle: `@${process.env.MECARD_CONTACT_LINKEDIN_HANDLE}`,
      url: `https://linkedin.com/in/${process.env.MECARD_CONTACT_LINKEDIN_HANDLE}`,
    },
    
    github: (process.env.MECARD_CONTACT_GITHUB_ENABLED || 'true') === 'true' && {
      handle: `@${process.env.MECARD_CONTACT_GITHUB_HANDLE}`,
      url: `https://github.com/${process.env.MECARD_CONTACT_GITHUB_HANDLE}`,
    },
  },

  career: {
    company: {
      name: process.env.MECARD_CAREER_COMPANY_NAME,
      website: process.env.MECARD_CAREER_COMPANY_WEBSITE,
    },
    position: process.env.MECARD_CAREER_POSITION,
  },
});

const controller = async (req, res, next) => {
  try {
    const template = "taby-universal";

    const me = getData();
    res.render(template, me);
  } catch (error) {
    L.error(error);
    next(error);
  }
}

const vcardController = async (req, res, next) => {
  try {
    
    const me = getData();
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
    const me = getData();
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
      "start_url": `//${me.mecard.id}`,
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

router.route('/yeehuipoh')
  .get(controller);

router.route('/yeehuipoh/vcard')
  .get(vcardController);

router.route('/yeehuipoh/manifest.json')
  .get(manifestController);

module.exports = router;
