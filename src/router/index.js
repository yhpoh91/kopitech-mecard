const express = require('express');

const { L } = require('kopitech-logger')('Global Router');

const router = express.Router({ mergeParams: true });

const controller = async (req, res, next) => {
  try {
    const template = "taby";

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
    res.render(template, me);
  } catch (error) {
    L.error(error);
    next(error);
  }
}

router.route('/yeehuipoh')
  .get(controller);

module.exports = router;
