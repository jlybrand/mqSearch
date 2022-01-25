const dbModel = require('../models/dbModel');
const mqModel = require('../models/mqModel')
const mail = require('./mail');
let message;

function areEligible(targetsLength) {
  if (targetsLength >= 2) {
    message = `Your search resulted in ${targetsLength} referral sources for your practice!\nClick below to receive your Core Marketing Package.`
  } else {
    message = `It appears the majority of the results returned by search lie within an existing client's protected territory.\nTry increasing your search radius to find an adequiate amount of referral sources.`
  }

  this.eligible = targetsLength >= 2;
  return this.eligible;
}

const searchController = {
  getSearchResponse: async (req, res) => {
    try {
      const body = req.body;
      const data = await mqModel.getData(req, res);
      dbModel.targets = await dbModel.filterResultsAndFormatPhone(body.address, data);
      const prospectInfo = [body.address, body.zipcode];
      const prospect = dbModel.getProspect(prospectInfo, data);

      if (prospect) var prospectCreated = await dbModel.storeProspect(prospect);

      if (prospectCreated) {
        dbModel.prospect = prospect;
        // mail.sendProspectEmailToAdmin();
      }

      const eligibile = areEligible(dbModel.targets.length, data.length);

      res.render('results', {
        title: 'Search Results',
        targets: dbModel.targets,
        eligibile: eligibile,
        message: message,
      });

    } catch (error) {
      console.log(error);
      res.render('error', {
        error: 'There was an error with your search from searchCon...',
      });
    }
  },
}

module.exports = searchController;