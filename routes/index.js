var express = require('express');
var router = express.Router();

/////////////////////////////////////
// GET home page
/////////////////////////////////////
router.get('/', function(req, res){
  res.render('index');
});

/////////////////////////////////////
// GET main page
/////////////////////////////////////
router.get('/main', function(req, res){
  // view template(main.handlebars)을 렌더링한다.
  res.render('main', {
    title: 'main',
    msg: 'Welcome',
    // id: req.session.user,
    logout_display: false
  });
});

module.exports = router;
