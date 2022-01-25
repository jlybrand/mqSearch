const config = require("../lib/config");
const axios = require('axios');
const API_URL = config.API_URL;
const API_KEY_NAME = config.API_KEY_NAME;
const API_KEY_VALUE = config.API_KEY_VALUE;
const sicCode = "802101";

const mqModel = {

  getData: async (req, res) => {
    const formInput = req.body;
    const address = formInput.address.trim();
    const zipcode = formInput.zipcode.trim();
    const origin = `${address} ${zipcode}`;
    const params = {
      "origin": origin,
      "hostedDataList": [
        {
          "tableName": "mqap.ntpois",
          "extraCriteria": "group_sic_code LIKE ?",
          "parameters": [
            "802101"     // formInput.sicCode if using dropdown menu
          ],
          "columnNames": [
            "name",
            "address",
            "city",
            "state",
            "postal_code",
            "phone",
            "group_sic_code",
          ]
        }
      ],
      "options": {
        "radius": formInput.radius,
        "maxMatches": 4000
      }
    };

    if (config.NODE_ENV !== 'production') {
      console.log(`REQUEST: ${API_URL}?origin=${address} ${zipcode}, radius=${formInput.radius}`);
    }

    try {
      const apiResponse =
        await axios.post(`${API_URL}?${API_KEY_NAME}=${API_KEY_VALUE}`, params);

      let searchResults = apiResponse.data.searchResults;

      // fields are all of the results returned - no formatting or filtering
      const fields =
        searchResults.map(result => {
          return result.fields;
        });

      return fields;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
}

module.exports = mqModel;