const express     = require('express'),
      multer      = require('multer'),
      upload      = multer({storage: multer.memoryStorage()}),
      fs          = require('fs'),
      mime        = require('mime-types'),
      https       = require('https'),
      request     = require('request'),
      parseString = require('xml2js').parseString,
      bodyParser  = require('body-parser'),
      app         = express();

const port = process.env.PORT || 3060;

app.use(bodyParser.raw({type: 'text/xml'}));
//app.use(xmlParser(parserOptions));

app.get('/', (req, res) => {
    res.send(`<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.3.0/css/bulma.min.css">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css">
        <style type="text/css">
        .hero.is-primary {
            background-color: #3c6994;
        }
        
        .is-horizontal {
            margin: 0 auto;
        }
        </style>
    </head>
    <body>
        <a href="https://github.com/aequasi/profiler-converter">
            <img style="position: absolute; top: 0; right: 0; border: 0;" src="https://camo.githubusercontent.com/52760788cde945287fbb584134c4cbc2bc36f904/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f77686974655f6666666666662e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_white_ffffff.png">
        </a>
        <section class="hero is-primary is-fullheight">
            <div class="hero-head">
                <header class="nav">
                    <div class="nav-center">
                        <h2 class="title nav-item is-2">
                            Zzukbot Profile Converter - XML to JSON
                        </a>
                    </div>
                </header>
            </div>
            <div class="hero-body">
                <div class="container has-text-centered">
                    <form enctype="multipart/form-data" method="post" style="width: 300px;margin: 0 auto;">
                        <div class="control is-grouped">
                            <div class="control is-horizontal">
                                <div class="control">
                                    <input type="file" name="file" class="file" accept=".xml" />
                                </div>
                            </div>
                            <div class="control is-horizontal">
                                <input class="button is-info is-fullwidth" type="submit" value="Generate" />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    </body>
</html>

`);
});

/**
 *
 * @param {{Name: string, Type: string, Profile: Object}} json
 * @param name
 * @param type
 * @returns {Promise}
 */
function normalizeJson(json, name, type) {
    return new Promise(resolve => {
        let data = Object.assign({}, {Name: name, Type: type}, json);
        
        let hotspots = ['Hotspot', 'VendorHotspot', 'GhostHotspot'];
        for (let hotspot of hotspots) {
            if (data.Profile && data.Profile[hotspot + 's']) {
                if (!Array.isArray(data.Profile[hotspot + 's'][hotspot])) {
                    data.Profile[hotspot + 's'][hotspot] = [data.Profile[hotspot + 's'][hotspot]];
                }
                
                data.Profile[hotspot + 's'] = data.Profile[hotspot + 's'][hotspot].map(h => {
                    return Object.assign(h, {
                        X: parseFloat(h.X),
                        Y: parseFloat(h.Y),
                        Z: parseFloat(h.Z),
                    })
                })
            }
        }
        
        
        if (data.Profile && data.Profile.Repair) {
            if (!Array.isArray(data.Profile.Repair)) {
                data.Profile.Repair = [data.Profile.Repair];
            }

            data.Profile.Repair = data.Profile.Repair.map(r => {
                return {
                    X:    parseFloat(r.Position.X),
                    Y:    parseFloat(r.Position.Y),
                    Z:    parseFloat(r.Position.Z),
                    Name: r.Name[0],
                }
            })
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

app.post('/xml/:name/:type?', (req, res) => {
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

app.post('/:noDownload?', upload.single('file'), (req, res) => {
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

app.get('/hat', (req, res) => {
    request("http://www.theopen-road.com/wp-content/uploads/2014/03/rabbit-hat.jpg").pipe(res);
});

app.listen(port, () => {
    console.log("Listening on http://localhost:" + port);
});
