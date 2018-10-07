var express = require('express');
var exphbs = require('express-handlebars')

var databaseHandler = require('./middleware/databasehandler')
var database = databaseHandler(process.env.DATABASE_URL || 'postgres://postgres:pass@localhost:5432/listner');


var bodyparser = require('body-parser');
var actionHandler = require('./middleware/actionhandler')

var handleBars = exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  layoutsDir: __dirname + '/web/views/layouts',
  partialsDir: __dirname + '/web/views/partials'
})

var app = express();
app.set('port', (process.env.PORT || 8080));
app.set('view engine', '.hbs');
app.set('views', __dirname + '/web/views');

app.engine('.hbs', handleBars )

app.use(express.static(__dirname + '/web/static'));
app.use(database);

app.get('/', (req, res) => {res.render('pages/list');});
app.get('/contact', (req, res) => {res.render('pages/contact');});
app.get('/stop', (req, res) => {console.log('Stop requested'); process.exit(0)});
app.use("/action", bodyparser.json(), actionHandler);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
