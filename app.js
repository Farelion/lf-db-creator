var fs = require('fs');                                        // load filesave from node

var lootTable = {
            dungeons:{                                          // create variable to store data that will be saved to json file
                ad: [],
                fh: [],
                td: [],
                ml: [],
                wm: [],
                under: [],
                sob: [],
                tos: [],
                sots: [],
                kr: [],
                mechagon: [],
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
    ///// Atal'Dazar
    ///////////////////////////////////
    await createLootTable(9028, dungeonCounter)
    console.log('AtalDazar done.')
    
    ///////////////////////////////////
    ///// Freehold
    ///////////////////////////////////
    await createLootTable(9164, dungeonCounter)
    console.log('Freehold done.')

    ///////////////////////////////////
    ///// Tol Dagor
    ///////////////////////////////////
    await createLootTable(9327, dungeonCounter)
    console.log('Tol Dagor done.')

    ///////////////////////////////////
    ///// The Motherlode!!
    ///////////////////////////////////
    await createLootTable(8064, dungeonCounter)
    console.log('The Motherlode!! done.')

    ///////////////////////////////////
    ///// Waycrest Manor
    ///////////////////////////////////
    await createLootTable(9424, dungeonCounter)
    console.log('Waycrest Manor done.')

    ///////////////////////////////////
    ///// Underrot
    ///////////////////////////////////
    await createLootTable(9391, dungeonCounter)
    console.log('Underrot done.')

    ///////////////////////////////////
    ///// Siege of Boralus
    ///////////////////////////////////
    await createLootTable(9354, dungeonCounter)
    console.log('Siege of Boralus done.')

    ///////////////////////////////////
    ///// Temple of Sethraliss
    ///////////////////////////////////
    await createLootTable(9527, dungeonCounter)
    console.log('Temple of Sethraliss done.')

    ///////////////////////////////////
    ///// Shrine of the Storms
    ///////////////////////////////////
    await createLootTable(9525, dungeonCounter)
    console.log('Shrine of the Storms done.')

    ///////////////////////////////////
    ///// Kings Rest
    ///////////////////////////////////
    await createLootTable(9526, dungeonCounter)
    console.log('Kings Rest done.')

    ///////////////////////////////////
    ///// Mechagon
    ///////////////////////////////////
    await createLootTable(10036, dungeonCounter)
    console.log('Mechagon done.')



    async function createLootTable(arg, value) {

    let zone = await blizzard.wow.zone({ id: arg });
    let zoneData = zone.data;

    let format = {
        zoneId: zoneData.id,
        zoneName: zoneData.name,
            
        bosses: zoneData.bosses.map((boss, i) => ({
            journalId: boss.journalId,
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

