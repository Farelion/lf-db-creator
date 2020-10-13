# Database (json file) creator for https://github.com/Farelion/lf-react project.

### This app connects to Blizzard api, parse data and creates JSON file.

To run this app you will need:
- Blizzard account to get api keys
- Create /config folder and keys.js file inside with this code
```node
module.exports = {
    bnet: {
        clientID:'YOUR_CLIENT_ID',
        clientSecret:'YOUR_CLIENT_SECRET'
    }
};
```
- Make changes to [Blizzard.js](https://github.com/benweier/blizzard.js/tree/master) module

- - Add code to blizzard.js/lib/wow.js
```node
/**
 * Fetch World of Warcraft journal-encounter data by id.
 *
 * @param {Object} [args]
 * @param {Number} args.id A journal encounter ID
 * @return {Promise} A thenable Promises/A+ reference
 */
WoW.prototype.journal = function getJournal({ id, ...args } = {}) {
  return this.blizzard.get(
    `/data/wow/journal-encounter/${id}`,
    merge({}, args, {
      namespace: 'static',
    }),
  );
};

/**
 * Fetch World of Warcraft journal-instance data by id.
 *
 * @param {Object} [args]
 * @param {Number} args.id A journal instance ID
 * @return {Promise} A thenable Promises/A+ reference
 */
WoW.prototype.journalInstance = function getJournalInstance({ id, ...args } = {}) {
  return this.blizzard.get(
    `/data/wow/journal-instance/${id}`,
    merge({}, args, {
      namespace: 'static',
    }),
  );
};

```

- - Not necessary: Delete headers to avoid erros from browser in blizzard.js/lib/blizzard.js
