const multer      = require('multer'),
      parseString = require('xml2js').parseString,
      bodyParser  = require('body-parser'),
      Validator   = require('jsonschema').Validator,
      upload      = multer({storage: multer.memoryStorage()});

// Schemas
const
    ProfileData = require('../schema/ProfileData.schema'),
    Profile     = require('../schema/Profile.schema'),
    Hotspot     = require('../schema/Hotspot.schema'),
    Mob         = require('../schema/Mob.schema');

/**
 *
 * @param {{Name: string, Type: string, Profile: {Hotspot: *, VendorHotspot: *, GhostHotspot: *, Factions: *, Repair: *}}} json
 * @param name
 * @param type
 * @returns {Promise}
 */
function normalizeJson(json, name, type) {
    return new Promise(resolve => {
        let data = Object.assign({}, {Name: name, Type: type}, json);
        
        if (data.Profile) {
            let hotspots = ['Hotspot', 'VendorHotspot', 'GhostHotspot', 'Blackspot'];
            for (let hotspot of hotspots) {
                if (data.Profile[hotspot + 's']) {
                    if (!Array.isArray(data.Profile[hotspot + 's'][hotspot])) {
                        data.Profile[hotspot + 's'][hotspot] = [data.Profile[hotspot + 's'][hotspot]];
                    }
                    
                    data.Profile[hotspot + 's'] = data.Profile[hotspot + 's'][hotspot].map(h => {
                        if (hotspot === 'Blackspot') {
                            h.Radius = parseFloat(h.Radius);
                        }
                        
                        return Object.assign(h, {
                            X: parseFloat(h.X),
                            Y: parseFloat(h.Y),
                            Z: parseFloat(h.Z),
                        })
                    })
                }
            }
            
            if (data.Profile.Factions) {
                if (!Array.isArray(data.Profile.Factions.Faction)) {
                    data.Profile.Factions.Faction = [data.Profile.Factions.Faction];
                }
                
                data.Profile.Factions = data.Profile.Factions.Faction.map(f => parseInt(f))
            }
            
            if (data.Profile.Repair) {
                if (!Array.isArray(data.Profile.Repair)) {
                    data.Profile.Repair = [data.Profile.Repair];
                }
                
                data.Profile.Repair = data.Profile.Repair.map(r => {
                    return {
                        X:    parseFloat(r.Position.X),
                        Y:    parseFloat(r.Position.Y),
                        Z:    parseFloat(r.Position.Z),
                        Name: r.Name,
                    }
                })
            }
        }
        
        resolve(data);
    });
}

function parseXml(xml) {
    return new Promise((resolve, reject) => {
        parseString(xml, {explicitArray: false}, (err, json) => {
            if (err) {
                return reject(err);
            }
            
            resolve(json);
        })
    });
}

module.exports = router => {
    const v = new Validator();
    //v.addSchema(ProfileData, ProfileData.id);
    v.addSchema(Profile, Profile.id);
    v.addSchema(Hotspot, Hotspot.id);
    v.addSchema(Mob, Mob.id);
    
    router.post('/validate', bodyParser.json(), (req, res) => {
        res.json(v.validate(req.body, ProfileData));
    });
};