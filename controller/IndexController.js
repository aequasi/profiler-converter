module.exports = router => {
    router.get('/', (req, res) => {
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
    router.get('/example', (req, res) => {
        res.json(require('../example/profile.json'));
    })
};
