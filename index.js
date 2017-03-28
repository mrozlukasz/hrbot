var express = require('express'),
    mongoose = require('mongoose'),
    morgan     = require('morgan'),
    request = require('request'),
    bodyParser = require('body-parser');

mongoose.connect(process.env.MONGODB_URI, function (error) {
    if (error) console.error(error);
    else console.log('mongo connected');
});

var app = express();

app
    .use(morgan('dev')) // log requests to the console
    .use(bodyParser.json()) // support json encoded bodies
    .use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//create models
var models = require('./app/models.js')(mongoose);

// create our routers
var apiRouter = require('./app/api.js')(express.Router(), models.Item, models.Pharmacy),
    botsRouter = require('./app/bots.js')(request, express.Router(), process.env.TOKEN || 'token', process.env.VERIFY_TOKEN || 'verify');


// // REGISTER OUR ROUTES -------------------------------
app.use('/api', apiRouter);
app.use('/webhook', botsRouter);

// START THE SERVER
// =============================================================================
app.set('port', (process.env.PORT || 5000));

console.log('Magic happens on port ' + app.get('port'));


app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


