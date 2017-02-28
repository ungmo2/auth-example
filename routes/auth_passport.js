var express = require('express');
var router  = express.Router();
var passport = require('passport');

var User = require('../models/user');

///////////////////////////////////////////////
// 사용자 인증 요청
///////////////////////////////////////////////
// 1. passport.use(new LocalStrategy(..))가 호출된다
// 2. passport.authenticate('local', function(err, user, info){})의 콜백함수 인자로 1의 실행 결과가 전달되고 콜백함수가 실행된다
router.post('/signin', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    console.log('***사용자 인증 요청');
    console.log('*클라이언트 입력 사용자정보');
    console.log(req.body);

    if (err) { return next(err); }

    // 사용자 인증 실패
    if (!user) {
      console.log('*사용자 인증 실패');

      return res.send({
        result : false,
        msg: info.message
      });
    }

    // 사용자 인증 성공
    // serializeUser 메소드를 호출하여 사용자정보를 세션에 등록
    req.logIn(user, function(err) {
      if (err) { return next(err); }

      console.log('*사용자 인증 성공');

      // Remember는 일반 세션에 저장한다. passport가 관리하는 user객체는 변경되지 않기 때문이다.
      // 단 클라이언트에서 Remember에 체크를 하지 않아 undefined가 전달된 경우 0으로 변경하여 저장한다.
      req.session.rem = req.body.remember ? 1 : 0;

      res.send({ result : true });
    });
  })(req, res, next);
});

///////////////////////////////////////////////
// Sign in with Facebook 요청 라우터
///////////////////////////////////////////////
// 사용자인증을 위해 Facebook으로 리디렉션한다.
// 완료되면 Facebook은 /auth/facebook/callback으로 다시 리디렉션한다.
router.get('/facebook', passport.authenticate('facebook'));

// router.get('/facebook/callback', function(req, res, next) {
//   passport.authenticate('facebook', function(err, user, info) {
//     if (err) { return next(err); }
//     // 사용자 인증 실패
//     if (!user) { res.redirect('/'); }
//
//     // 사용자 인증 성공
//     // serializeUser 메소드를 호출하여 사용자정보를 세션에 등록
//     req.logIn(user, function(err) {
//       if (err) { return next(err); }
//
//       res.redirect('/main?from=facebook');
//     });
//   })(req, res, next);
// });

// 사용자 인증 결과
router.get('/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/main?from=facebook',
    failureRedirect: '/'
  })
);

///////////////////////////////////////////////
// 신규 사용자 생성 요청
///////////////////////////////////////////////
router.post('/signup', function(req, res){
  console.log('***사용자 생성 요청');
  console.log('*클라이언트 입력 사용자정보');
  console.log(req.body);

  User.findOne({ 'username' : req.body.username }, function(err, user) {
    if(err) return res.status(500).send(err);

    // username이 중복되는 사용자가 없을때 신규 사용자로 등록
    if(!user){
      User.create(req.body, function (err, newUser) {
        if(err) return res.status(500).send(err);
        console.log('*사용자 생성 성공');
        console.log(newUser);
        return res.send({ result : true });
      });
    } else {
      return res.send({
        result : false,
        msg: '입력하신 이메일은 이미 사용되고 있습니다. 다른 이메일을 입력하세요.'
      });
    }
  });
});

///////////////////////////////////////////////
// LOG-OUT
///////////////////////////////////////////////
// Session을 파기하고 시작 페이지로 이동
router.get('/signout', function (req, res) {
  console.log('***LOG-OUT 요청');

  req.logout();
  console.log('*Session 파기');
  
  // AJAX호출 후에 리다이레션 불가
  res.send({redirect: '/'});
});

module.exports = router;
