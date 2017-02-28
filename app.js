//======================================================================
// SET UP
// Dependency
var express    = require('express');
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var exphbs     = require('express-handlebars');
//Routes
var routes = require('./routes/index');
var users  = require('./routes/users');
var auth   = require('./routes/auth');
// Model
var User   = require('./models/user');
// Config
var config = require('./config/db');
// Express
var app = express();

//======================================================================
// CONFIGURATION
// Port
app.set('port', process.env.PORT || 3000);
// handlebars
app.engine('handlebars', exphbs({defaultLayout: false}));
// app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
// Static File Service
app.use(express.static('public'));
// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));

// CONNECT TO MONGODB SERVER
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connect successfully');
});

// database가 없으면 자동 생성된다
mongoose.connect(config.db);

//======================================================================
// ROUTES
app.use('/', routes);
app.use('/users', users);
app.use('/auth', auth);

//======================================================================
// LAUNCH SERVER
app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
