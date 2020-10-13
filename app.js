var fs = require('fs');                                        // load filesave from node

var lootTable = {
            dungeons:{                                          // create variable to store data that will be saved to json file
                dos: [],
                hoa: [],
                mots: [],
                pf: [],
                sd: [],
                soa: [],
                nw: [],
                top: [],
                }
            }


renderData = async() => {

    const keys = require('./config/keys');                  // get key for blizzard api
    const blizzard = require('blizzard.js').initialize({    // initialize blizzard.js
    key: keys.bnet.clientID,
    secret: keys.bnet.clientSecret,
    origin: 'us',
    locale: 'en_US'
    });

  try {
    await blizzard.getApplicationToken()                    // create token for api requests
    .then(response => {
        blizzard.defaults.token = response.data.access_token
    });

//// building loot table for all dungeons

    var dungeonCounter = 0;                                 // variable used for specifying in which dungeon items will be saved

    ///////////////////////////////////
    ///// De Other Side
    ///////////////////////////////////
    await createLootTable(1188, dungeonCounter)
    console.log('De Other Side done.')
    
    ///////////////////////////////////
    ///// Halls of Atonement
    ///////////////////////////////////
    await createLootTable(1185, dungeonCounter)
    console.log('Halls of Atonement done.')

    ///////////////////////////////////
    ///// Mists of Tirna Scithe
    ///////////////////////////////////
    await createLootTable(1184, dungeonCounter)
    console.log('Mists of Tirna Scithe done.')

    ///////////////////////////////////
    ///// Plaguefall
    ///////////////////////////////////
    await createLootTable(1183, dungeonCounter)
    console.log('Plaguefall done.')

    ///////////////////////////////////
    ///// Sanguine Depths
    ///////////////////////////////////
    await createLootTable(1189, dungeonCounter)
    console.log('Sanguine Depths done.')

    ///////////////////////////////////
    ///// Spires of Ascension
    ///////////////////////////////////
    await createLootTable(1186, dungeonCounter)
    console.log('Spires of Ascension done.')

    ///////////////////////////////////
    ///// The Necrotic Wake
    ///////////////////////////////////
    await createLootTable(1182, dungeonCounter)
    console.log('The Necrotic Wake done.')

    ///////////////////////////////////
    ///// Theater of Pain
    ///////////////////////////////////
    await createLootTable(1187, dungeonCounter)
    console.log('Theater of Pain done.')


    async function createLootTable(arg, value) {

    let zone = await blizzard.wow.journalInstance({ id: arg });
    let zoneData = zone.data;

    let format = {
        zoneId: zoneData.id,
        zoneName: zoneData.name,
            
        bosses: zoneData.encounters.map((boss, i) => ({
            journalId: boss.id,
            name: boss.name
        }))
        }
    
        for (var i = 0; i < format.bosses.length;) {
            let journal = await blizzard.wow.journal({ id: format.bosses[i].journalId });
            let journalData = journal.data;
            let formatJ = {
                journalId: journalData.id,
                bossName: journalData.name,
                instanceName: journalData.instance.name,
                items: journalData.items.map((items, i) => ({
                bossName: journalData.name,
                itemId: items.item.id,
                itemName: items.item.name
                }))
            }
            
            for (var k = 0; k < formatJ.items.length;) {
                let item = await blizzard.wow.itemData({ id: formatJ.items[k].itemId });
                let itemData = item.data;

                if ( itemData.item_class.name === 'Armor' || itemData.item_class.name === 'Weapon' ){
                    let formatI = {Item:
                                        {
                                        instanceName: formatJ.instanceName,
                                        bossName: formatJ.bossName,
                                        itemId: itemData.id,
                                        itemName: itemData.name,
                                        itemClass: itemData.item_class.name,
                                        itemSubClass: itemData.item_subclass.name,
                                        itemInvType: itemData.inventory_type.name,
                                        stats: itemData.preview_item.stats.map((stats,i) => ({
                                            statName: stats.type.name
                                        }))
                                        }
                                    }
                lootTable.dungeons[Object.keys(lootTable.dungeons)[value]].push(formatI.Item) 
                }
                k++;
            }
            i++            
        }
        dungeonCounter++
    }
    

    ///////////////////////////////////
    ///// Create db file.
    ///////////////////////////////////
    var data = JSON.stringify(lootTable, null, 2);
    fs.writeFile('db.json', data, finished)
    function finished (err){console.log('done');}

         
  } 
  catch (err) {
      console.error(err);
  }
}

renderData();

