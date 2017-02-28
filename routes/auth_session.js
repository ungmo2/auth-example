var express = require('express');
var router  = express.Router();

var User = require('../models/user');

///////////////////////////////////////////////
// 사용자 인증 요청
///////////////////////////////////////////////
router.post('/signin', function(req, res){
  console.log('***사용자 인증 요청');
  console.log('*클라이언트 입력 사용자정보');
  console.log(req.body);

  //Find user
  User.findOne({ 'username' : req.body.username }, function(err, user) {

    console.log('*DB로부터 취득한 사용자정보:\n' + user);

    // DB Error
    if(err) return res.status(500).send(err);

    if(!user) {
      console.log('*사용자 인증 실패');

      return res.send({
        result : false,
        msg: '등록되지 않은 아이디입니다. 아이디를 다시 확인하세요.'
      });
    } else if(req.body.password !== user.password) {
      res.send({
        result : false,
        msg: '패스워드를 잘못 입력하셨습니다.'
      });
    } else {
      console.log('*사용자 인증 성공');

      // 사용자 정보(username)를 세션에 저장
      if(req.session.user !== req.body.username) {
        req.session.user = req.body.username;
        console.log('*첫번째 세션 등록: ' + req.session.user);
      }

      // Remember는 항상 세션에 update한다
      // 단 클라이언트에서  Remember에 체크를 하지 않아 undefined가 전달된 경우 0으로 변경하여 저장한다.
      req.session.rem = req.body.remember ? 1 : 0;

      return res.send({ result : true });
    }
  });
});

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

  req.session.destroy();
  console.log('*Session 파기');
  
  // AJAX호출 후에 리다이레션 불가
  res.send({redirect: '/'});
});

module.exports = router;
