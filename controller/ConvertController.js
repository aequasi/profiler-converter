const multer      = require('multer'),
      bodyParser = require('body-parser'),
      parseString = require('xml2js').parseString,
      upload      = multer({storage: multer.memoryStorage()});

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
    router.post('/xml/:name/:type?', bodyParser.raw({type: 'text/xml'}), (req, res) => {
        parseXml("" + req.body)
            .then(json => {
                normalizeJson(json, req.params.name, req.params.type || 'grinding')
                    .then(json => {
                        res.status(200).json(json);
                    })
                    .catch(err => res.status(500).send(err.stack));
            })
            .catch(err => res.status(500).send(err.stack));
    });
    
    router.post('/:noDownload?', upload.single('file'), (req, res) => {
        parseXml(req.file.buffer)
            .then(json => {
                normalizeJson(json, req.file.originalname, "grinding")
                    .then(data => {
                        if (req.params.noDownload === '1') {
                            res.json(data);
                            
                            return
                        }
                        
                        res.setHeader('Content-disposition', `attachment; filename= ${req.file.originalname.replace('.xml', '.json')}`);
                        res.setHeader('Content-type', 'application/json');
                        res.write(JSON.stringify(data, null, 4), err => {
                            res.end();
                        });
                    })
                    .catch(err => res.status(500).send(err.stack));
            })
            .catch(err => res.status(500).send(err.stack));
    });
}