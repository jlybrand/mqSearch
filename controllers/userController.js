const config = require("../lib/config");
const dbModel = require('../models/dbModel');
const mqModel = require('../models/mqModel')
const mail = require('./mail');

const userController = {
  storeUser: async (req, res) => {
    try {
      const userCreated = await dbModel.createUser(req.body);

      if (userCreated) {
        var targetsCreated = await dbModel.storeTargets();
      } else {
        // email Admin error message...
        // implement logic to alert user of the error, username exists/email exists
        res.render('error', {
          error: 'It appears an account with the entered information exists.'
        });
      }

      if (!targetsCreated) {
        // email user and admin account info and error message...
        res.render('error', {
          error: 'Your account has been successfully created, however, there was an error creating the associated referral sources in the database. An associate will be in conact with you very soon to resolve this matter. Thank you for your patience.'
        });
      }

      // email user and admin account info and target info...
      res.render('created', {
        title: 'Account Created',
        username: dbModel.username,
        targets: dbModel.targets,
        created: targetsCreated,
      });
    } catch (error) {
      console.log(error);
      res.render('error', {
        error: 'There was error creating you account from userCon.'
      });
    }
  },

}

module.exports = userController;