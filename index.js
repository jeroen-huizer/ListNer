var express = require('express');
var exphbs = require('express-handlebars')


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

app.get('/', (req, res) => {
  res.render('pages/home');
});

app.get('/contact', (req, res) => {
  res.render('pages/contact');
});

app.get('/stop', (req, res) => {console.log('Stop requested'); process.exit(0)});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});