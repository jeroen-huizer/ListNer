// Server
var express = require('express');
// Page rendering
var handlebars = require('express-handlebars');

// Database connection
var databaseHandler = require('./middleware/databasehandler');
var database = databaseHandler(process.env.DATABASE_URL || 'postgres://postgres:pass@localhost:5432/listner');

// Authentication
var users = require('./middleware/userhandler');
var passport = require('passport');
var local = require('passport-local').Strategy;

passport.use(new local(users.auth));


// Request parser
var bodyparser = require('body-parser');

// Custom request handler
var actionHandler = require('./middleware/actionhandler');


// Init the app
var app = express();
app.set('port', (process.env.PORT || 8080));
app.set('view engine', '.hbs');
app.set('views', __dirname + '/web/views');

app.engine('.hbs', handlebars({
  defaultLayout: 'main',
  extname: '.hbs',
  layoutsDir: __dirname + '/web/views/layouts',
  partialsDir: __dirname + '/web/views/partials'
}));

app.use(express.static(__dirname + '/web/static'));
app.use(database);

// Routes
app.get('/', auth_local(), (req, res) => {res.render('pages/list');});
app.get('/contact', (req, res) => {res.render('pages/contact');});
app.get('/stop', (req, res) => {console.log('Stop requested'); process.exit(0)});
app.use("/action", bodyparser.json(), actionHandler);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

/* Functions and utils */
function auth_local(successRedirect){
  return passport.authenticate('local', {   failureRedirect: '/contact',
                                     failureFlash: false });
}
