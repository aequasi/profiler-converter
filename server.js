const express    = require('express'),
      request    = require('request'),
      bodyParser = require('body-parser'),
      app        = express();

require('./controller/IndexController')(app);
require('./controller/ValidateController')(app);
require('./controller/ConvertController')(app);

const port = process.env.PORT || 3060;

app.get('/hat', (req, res) => request("http://www.theopen-road.com/wp-content/uploads/2014/03/rabbit-hat.jpg").pipe(res));

app.listen(port, () => {
    console.log("Listening on http://localhost:" + port);
});
