var express = require('express');
var router = express.Router();

/////////////////////////////////////
// Route middleware : 사용자 인증 여부 확인
/////////////////////////////////////
var isAuthorized = function(req, res, next) {
  console.log('[isAuthorized] SESSION: ');
  console.log(req.session);

  // 로그인한 사용자인 경우, 세션에 사용자 정보가 저장되어 있다.
  // 로그인 사용자인 경우, 다음으로
  // 로그인하지 않은 사용자인 경우, 로그인 페이지로
  if(req.session && req.session.user) {
    return next();
  }
  res.redirect('/');
};

/////////////////////////////////////
// GET home page
/////////////////////////////////////
router.get('/', function(req, res){
  if(req.session && req.session.rem) {
    res.render('index', {user: req.session.user, rem: 'checked'});
  } else {
    res.render('index', {user: '', rem: ''});
  }
});

/////////////////////////////////////
// GET main page
/////////////////////////////////////
router.get('/main', isAuthorized, function(req, res){
  // view template(main.handlebars)을 렌더링한다.
  res.render('main', {
    title: 'main',
    msg: 'Welcome',
    id: req.session.user,
    logout_display: true
  });
});

module.exports = router;
