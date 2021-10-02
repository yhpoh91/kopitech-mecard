const express = require('express');
const VCard = require('vcard-creator').default;

const { L } = require('kopitech-logger')('Global Router');

const router = express.Router({ mergeParams: true });

const controller = async (req, res, next) => {
  try {
    const template = "taby-portrait";

    const me = {
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
    };
    res.render(template, me);
  } catch (error) {
    L.error(error);
    next(error);
  }
}

const vcardController = async (req, res, next) => {
  try {
    const me = {
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
    };

    const vcard = new VCard();
    vcard
      .addName(me.personal.lastName, me.personal.firstName)
      .addEmail(me.contact.email)
      .addPhoneNumber(me.contact.phoneNumber)
      .addCompany(me.career.company.name)
      .addJobtitle(me.career.position)
      .addURL(me.career.company.website, "WORK")

    res.set({ "Content-Disposition": `attachment; filename=\"${me.personal.firstName}_${me.personal.lastName}_vcard.vcf\"` });
    res.send(vcard.toString());
  } catch (error) {
    L.error(error);
    next(error);
  }
}

router.route('/yeehuipoh')
  .get(controller);

router.route('/yeehuipoh/vcard')
  .get(vcardController);

module.exports = router;
