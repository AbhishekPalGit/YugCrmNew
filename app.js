var express = require('express');
var app = express();
var constant = require('./config/constants');

var port = process.env.PORT || 8045;
var flash = require('connect-flash');
var path = require('path');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
const xssFilter = require('x-xss-protection');
var cors = require('cors');
var request = require('http');

app.use(xssFilter());

app.use(bodyParser.json({limit: '20mb', extended: true}));

app.use(bodyParser.urlencoded({extended: true}));

app.use('/assets/profilePhotos', express.static('assets/profilePhotos'));

/* Below code will handle invalid json error */ // START
app.use((err, req, res, next) => {
    // This check makes sure this is a JSON parsing issue, but it might be
    // coming from any middleware, not just body-parser:
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error(err);
        return res.sendStatus(400); // Bad request
    }
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
/* Below code will handle invalid json error */ // END

//set up our express application
const corsOpts = {
  origin: '*'
};
app.use(cors(corsOpts));
// app.use(cors());
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)

//view engine setup
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'ejs');

app.use(session({
    secret: 'ZXhwcmVzc3NlY3JldA==',
    resave: true,
    saveUninitialized: true
}));

app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./config/routes.js')(app); // load our routes and pass in our app and fully configured passport

app.disable('x-powered-by');

//launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);

//catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.status(404).render('404', {title: "Sorry, page not found", session: req.sessionbo});
});

app.use(function (req, res, next) {
    res.status(500).render('404', {title: "Sorry, page not found"});
});

exports = module.exports = app;