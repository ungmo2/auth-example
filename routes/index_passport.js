var express = require('express');
var router = express.Router();

/////////////////////////////////////
// Route middleware : 사용자 인증 여부 확인
/////////////////////////////////////
var isAuthorized = function(req, res, next) {
  console.log('[isAuthorized]');
  console.log(req.user);

  // 로그인이 되어 있으면, 다음 파이프라인으로 진행
  if (req.isAuthenticated()) { return next(); }
  // 로그인이 안되어 있으면, login 페이지로 진행
  res.redirect('/');
};

/////////////////////////////////////
// GET home page
/////////////////////////////////////
router.get('/', function(req, res){

  // 사용자정보는 passport 세션(req.user)에 저장되어 있다
  // remember는 일반세션에 저장되어 있다
  // 첫 로그인의 경우, passport 세션(req.user)이 존재하지 않는다
  if(req.user && (req.user.username && req.session.rem)) {
    res.render('index', {user: req.user.username, rem: 'checked'});
  } else {
    res.render('index', {user: '', rem: ''});
  }
});

/////////////////////////////////////
// GET main page
/////////////////////////////////////
router.get('/main', isAuthorized, function(req, res){

  console.log(req.query.from);
  var username;
  if(req.query.from) {
    // Facebook Login
    username = req.user.displayName;
  } else {
    // Local Login
    username = req.user.username;
  }

  // view template(main.handlebars)을 렌더링한다.
  res.render('main', {
    title: 'main',
    msg: 'Welcome',
    // id: req.user.username,
    id: username,
    logout_display: true
  });
});

module.exports = router;
