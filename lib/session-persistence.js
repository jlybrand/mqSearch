const SeedData = require("./seed-data");
const deepCopy = require("./deep-copy");

module.exports = class SessionPersistence {
  constructor(session) {
    this._searchResults = session.searchResults || deepCopy(SeedData);
    session.searchResults = this.searchResults;
  }
};
