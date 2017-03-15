const express     = require('express'),
      multer      = require('multer'),
      upload      = multer({storage: multer.memoryStorage()}),
      fs          = require('fs'),
      mime        = require('mime-types'),
      https       = require('https'),
      request     = require('request'),
      parseString = require('xml2js').parseString,
      app         = express();

const port = process.env.PORT || 3060;

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

app.post('/', upload.single('file'), (req, res) => {
    console.log(`Converting ${req.file.originalname} to the JSON.`);
    
    parseString(req.file.buffer, (err, result) => {
        let hotspots = ['Hotspot', 'VendorHotspot', 'GhostHotspot'];
        for (let hotspot of hotspots) {
            if (result.Profile && result.Profile[hotspot + 's'] && result.Profile[hotspot+'s'][0]) {
                result.Profile[hotspot + 's'] = result.Profile[hotspot + 's'][0][hotspot].map(h => {
                    return {
                        X: parseFloat(h.X[0]),
                        Y: parseFloat(h.Y[0]),
                        Z: parseFloat(h.Z[0]),
                    }
                })
            }
        }
        if (result.Profile.Repair) {
            result.Profile.Repair = result.Profile.Repair.map(r => {
                return {
                    Position: {
                        X: parseFloat(r.Position[0].X[0]),
                        Y: parseFloat(r.Position[0].Y[0]),
                        Z: parseFloat(r.Position[0].Z[0]),
                    },
                    Name: r.Name[0]
                }
            })
        }
        
        let json = Object.assign(
            {},
            {
                Name: req.file.originalname,
                Type: "grinding",
            },
            result
        );
        
        const data = JSON.stringify(json, null, 4);
        //console.log(data);
        res.setHeader('Content-disposition', `attachment; filename= ${req.file.originalname.replace('.xml', '.json')}`);
        res.setHeader('Content-type', 'application/json');
        res.write(data, err => {
            res.end();
        });
    })
});

app.listen(port, () => {
    console.log("Listening on http://localhost:" + port);
});
