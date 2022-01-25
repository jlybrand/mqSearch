const { dbQuery } = require("../lib/db-query");
const bcrypt = require('bcrypt');

function hashPassword(password) {
  return bcrypt.hashSync(password, 10, (err, hash) => {
    if (err) {
      console.log('hashPassword error: ', err);
    }
    return hash;
  })
}

let user = undefined;
const dbModel = {

  prospect: undefined,
  targets: undefined,
  username: undefined,

  createUser: async (req, res) => {
    try {
      user = req;
      dbModel.username = user.username;
      const STORE_USER_CREDENTIALS =
        "INSERT INTO clients (first_name, last_name,email, username, password) VALUES ($1, $2, $3, $4, $5)";

      user.password = hashPassword(user.password);

      var result =
        await dbQuery(STORE_USER_CREDENTIALS, user.firstname, user.lastname, user.email, user.username, user.password);

    } catch (error) {
      console.log(error);
      return false;
    }

    return result.rowCount > 0;
  },

  storeTargets: async (req, res) => {
    const body = req;
    try {
      const STORE_USER_TARGETS = "INSERT INTO targets (name, address, city, state, postal_code, phone, username) VAlUES ($1, $2, $3, $4, $5, $6, $7)";

      for (let i = 0; i < dbModel.targets.length; i++) {
        let target = dbModel.targets[i];
        var result =
          await dbQuery(STORE_USER_TARGETS, target.name, target.address, target.city, target.state, target.postal_code, target.phone, user.username);
      }

      return result.rowCount > 0;

    } catch (error) {
      console.log(error);
      return false;
    }
  },


  storeProspect: async (prospect) => {
    const INSERT_PROSPECT =
      "INSERT INTO prospects (name, address, city, state, postal_code, phone) VALUES ($1, $2, $3, $4, $5, $6)";

    try {
      const result =
        await dbQuery(INSERT_PROSPECT, prospect.name, prospect.address, prospect.city, prospect.state, prospect.postal_code, prospect.phone);
      return result.rowCount > 0;

    } catch (error) {
      console.log(error);
      return false;
    }
  },

  getStoredAddresses: async () => {
    const FIND_ALL_TARGETS = "SELECT address FROM targets";
    const records =
      await dbQuery(FIND_ALL_TARGETS);

    return records.rows.map(record => record.address);
  },

  getProspect: (prospectInfo, results) => {
    return results.filter(result => {
      return prospectInfo.includes(result.address);
    })[0];
  },

  filterResultsAndFormatPhone: async (address, data) => {
    const filteredResults = dbModel.filterOutProspect(address, data);
    const eligibleResults = await dbModel.getElligibleResults(filteredResults);
    const formattedResults = dbModel.formatPhoneNumbers(eligibleResults);

    return formattedResults;
  },

  filterOutProspect: (searchOrigin, results) => {
    return results.filter(result => searchOrigin !== result.address);
  },

  getElligibleResults: async (results) => {
    try {
      let storedAdresses = await dbModel.getStoredAddresses();
      const eligibleResults = results.filter(result => {
        return !storedAdresses.includes(result.address);
      });

      return eligibleResults;

    } catch (error) {
      console.log(error);
    }
  },

  formatphoneNumber: (phoneNumber) => {
    let cleanedNumber = phoneNumber.replace(/[^\d]/g, "").substring(1);
    let formattedNumber = cleanedNumber.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");

    return formattedNumber;
  },

  formatPhoneNumbers: (results) => {
    const keys = [
      'name', 'address', 'city', 'state',
      'postal_code', 'phone', 'group_sic_code'
    ];

    return results.map(result => {
      return keys.reduce((acc, curr) => {
        if (curr === 'phone') {
          acc[curr] = dbModel.formatphoneNumber(result[curr]);
        } else {
          acc[curr] = result[curr];
        }

        return acc;
      }, {});
    });
  },
}

module.exports = dbModel;
