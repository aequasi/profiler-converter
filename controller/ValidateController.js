const multer     = require('multer'),
      bodyParser = require('body-parser'),
      Validator  = require('jsonschema').Validator;

// Schemas
const
    ProfileData = require('../schema/ProfileData.schema'),
    Profile     = require('../schema/Profile.schema'),
    Hotspot     = require('../schema/Hotspot.schema'),
    Mob         = require('../schema/Mob.schema');

module.exports = router => {
    const v = new Validator();
    //v.addSchema(ProfileData, ProfileData.id);
    v.addSchema(Profile, Profile.id);
    v.addSchema(Hotspot, Hotspot.id);
    v.addSchema(Mob, Mob.id);
    
    router.use(bodyParser.urlencoded({extended: false}));
    router.use(bodyParser.json());
    router.post(
        '/validate',
        (req, res) => {
            if (req.body.profile !== undefined) {
                req.body = JSON.parse(req.body.profile);
            }
            
            res.json(v.validate(req.body, ProfileData));
        }
    );
    
    router.get('/validate', (req, res) => {
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
                            Zzukbot JSON Profile Validator
                        </a>
                    </div>
                </header>
            </div>
            <div class="hero-body">
                <div class="container has-text-centered">
                    <form method="post">
                        <div class="control">
                            <div class="control is-horizontal">
                                <div class="control">
                                    <textarea style="max-height: 1200px; min-height: 360px;" class="textarea is-fullwidth" name="profile" placeholder="Place JSON Here"></textarea>
                                </div>
                            </div>
                        </div>
                        <div class="control">
                            <div class="control is-horizontal">
                                <input class="button is-info is-fullwidth" type="submit" value="Validate" />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="hero-foot">
                <nav class="tabs">
                    <div class="container">
                        <ul>
                            <li class="is-active">Endpoints:</li>
                            <li><a>POST /:noDownload?</a></li>
                            <li><a>POST /xml/:name/:type? - Raw text/xml</a></li>
                            <li><a>POST /validate - Raw application/json</a></li>
                            <li><a>GET /example</a></li>
                        </ul>
                    </div>
                </nav>
            </div>
        </section>
    </body>
</html>

`);
    });
};