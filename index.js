var express = require('express');
var exphbs = require('express-handlebars');
var bodyparser = require('body-parser');
var actionHandler = require('./middleware/actionhandler')
var databaseHandler = require('./middleware/databasehandler')

var database = databaseHandler({	
					host: process.env.HOST || 'localhost',
					port: process.env.PORT || 5432,
					schema: process.env.SCHEMA || 'listner-test',
					user: process.env.USER || 'postgres',
					pass: process.env.PASS || 'pass'})

var handleBars = exphbs({  
				  	defaultLayout: 'main',
				  	extname: '.hbs',
				  	layoutsDir: __dirname + '/web/views/layouts',
				  	partialsDir: __dirname + '/web/views/partials'})

var jsonParser = bodyparser.json();

var app = express();
app.set('port', (process.env.PORT || 8080));
app.set('view engine', '.hbs');
app.set('views', __dirname + '/web/views');  

app.engine('.hbs', handleBars )

// Routes and middleware
app.use(express.static(__dirname + '/web/static'));	// Static routes
app.use(database); // Add database handle to each req
app.get('/', (req, res) => {res.render('pages/home');});
app.get('/contact', (req, res) => {res.render('pages/contact');});
app.get('/test', (req, res) => {res.render('pages/test')});
app.use('/action', jsonParser, actionHandler)
app.get('/stop', exitHandler);

app.listen(app.get('port'), function() {console.log('Running on port', app.get('port'));});

function exitHandler(req, res){
	console.log('Stop requested'); 
	process.exit(0);
}