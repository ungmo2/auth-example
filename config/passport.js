var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('./auth');

var User = require('../models/user');

// Passport Configuration
module.exports = function(passport) {
  // =============================================================
  // LOCAL SIGNIN
  // 라우터(router.post('/signin' function..)에 의해 호출된다
  passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username: username }, function(err, user) {
        console.log('[LocalStrategy]');
        console.log(user);

        if (err)  return done(err);
        if (!user) {
          return done(null, false, {
            message: '등록되지 않은 아이디입니다. 아이디를 다시 확인하세요.'
          });
        }
        if (user.password !== password) {
          return done(null, false, {
            message: '패스워드를 잘못 입력하셨습니다.'
          });
        }
        return done(null, user);
        });
      }
  ));

  // =============================================================
  // FACEBOOK SIGNIN
  passport.use(new FacebookStrategy({
      clientID: config.facebook.clientID,
      clientSecret: config.facebook.clientSecret,
      callbackURL: config.facebook.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
      console.log('[FacebookStrategy]');
      console.log(profile);

      done(null, profile);
    }
  ));

  // =============================================================
  // passport session setup
  // passport.use(new LocalStrategy...에 의해 사용자인증 성공시, user가 전달된다.
  // 그리고 사용자정보를 세션에 저장한다.
  passport.serializeUser(function(user, done) {
    console.log('[serializeUser]:', user);
    done(null, user);
  });

  // 페이지 이동시 호출되며 세션에서 사용자정보(user) 취득하여 request에 반환한다
  passport.deserializeUser(function(user, done) {
    console.log('[deserializeUser]:', user);
    done(null, user);
  });
};
