var Signin = function() {

  // Common Funtions
	// 에러 메시지 표시
  var showErrorMessage = function(elem, msg) {
    elem.text(msg).show();
  };

	// 에러 메시지 지우기
  var removeErrorMessage = function(elem) {
    elem.hide();
  };

	// username 체크
	// 체크 조건 : 이메일 형식
  var checkUsername = function(elem) {
    var regexr = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    return regexr.test(elem.val());
  };

	// password 체크
	// 체크 조건 : 4자리 이상
  var checkPassword = function(elem) {
    return elem.val().length > 3;
  };

  ///////////////////////////////////////////////////////////
  // SIGN-IN
  ///////////////////////////////////////////////////////////
  var handleSignin = function() {
    var $signinBox = $("#signin-box");
    var $signupBox = $("#signup-box");
    var $forgotPasswordBox = $("#forgot-password-box");
    var $signinAlert = $("#signin-alert");
    var $signinForm = $("#signin-form");
    var $username = $("#signin-form .username");
    var $password = $("#signin-form .password");
    var $btnSignin = $("#btn-signin");
    var $btnFbSignin = $("#btn-fb-signin");

    // username와 password 체크
    // username와 password 모두 체크를 통과하면 true를 반환한다.
    // 체크에 실패하면 에러 메시지 표시
    var checkForm = function() {

      if(!checkUsername($username)){
        showErrorMessage($signinAlert, '이메일 주소의 형식이 유효하지 않습니다.');
        return false;
      } else {
        removeErrorMessage($signinAlert);
      }

      if(!checkPassword($password)){
        showErrorMessage($signinAlert, '패스워드는 4자리 이상으로 입력해 주세요.');
        return false;
      } else {
        removeErrorMessage($signinAlert);
      }

      return true;
    };

    $("#signup-here").click(function() {
      $signinBox.hide();
      $signupBox.show();
      $forgotPasswordBox.hide();
    });

    $("#goto-signin, #btn-back").click(function() {
      $signinBox.show();
      $signupBox.hide();
      $forgotPasswordBox.hide();
    });

    $("#goto-forget-password").click(function() {
      $signinBox.hide();
      $signupBox.hide();
      $forgotPasswordBox.show();
    });

    // blur 이벤트 발생 시, username 체크
    $username.blur(function() {
      if(!checkUsername($(this))){
        showErrorMessage($signinAlert, '이메일 주소의 형식이 유효하지 않습니다.');
      } else {
        removeErrorMessage($signinAlert);
      }
    });

    // blur 이벤트 발생 시,  password 체크
    $password.blur(function() {
      if(!checkPassword($(this))){
        showErrorMessage($signinAlert, '패스워드는 4자리 이상으로 입력해 주세요.');
      } else {
        removeErrorMessage($signinAlert);
      }
    });

    // blur 후 click 이벤트가 발생하지 않는 문제 해결을 위한 처리
    $btnSignin.on("mousedown", function(event){
      event.preventDefault();
    });

    ////////////////////////////////////////////////
    // Sign in 버튼 클릭 이벤트 핸들러
    // form을 체크한 후, 서버에 사용자 인증을 요청한다.
    $btnSignin.click(function(event) {

      event.preventDefault();

      // username & password 체크에 실패한 경우, 서버에 인증을 요청하지 않는다.
      if(!checkForm()) return;

      // 서버에 인증을 요청한다.
      $.ajax({
          method: "POST",
          url: "/auth/signin",
          data: $signinForm.serialize()
        })
        .done(function(data){

          console.log(data);

          if(data && data.result){
            // 사용자 인증 성공
            window.location.href = "/main";
            console.log('Success');
          }else{
            // 사용자 인증 실패
            showErrorMessage($signinAlert, data.msg);
          }
        })
        .fail(function(err) {
          throw new Error("Signin failed", err);
        });
    });
  };

  ///////////////////////////////////////////////////////////
  // SIGN-UP
  ///////////////////////////////////////////////////////////
  var handleSignup = function() {
    var $signupForm = $("#signup-form");
    var $username = $("#signup-form .username");
    var $password = $("#signup-form .password");
    var $passwordConfirm = $("#signup-form .password-confirm");
    var $signupAlert = $("#signup-alert");
    var $btnSignup = $("#btn-signup");

    // Sign up 버튼 클릭 이벤트 핸들러
    // form을 체크한 후, 서버에 사용자 등록을 요청한다.
    $btnSignup.on("click", function(event) {

      event.preventDefault();

      var confirmPassword = function() {
        return ($password.val() === $passwordConfirm.val());
      };

      var checkForm = function() {

        if(!checkUsername($username)){
          showErrorMessage($signupAlert, '이메일 주소의 형식이 유효하지 않습니다.');
          return false;
        } else {
          removeErrorMessage($signupAlert);
        }

        if(!checkPassword($password)){
          showErrorMessage($signupAlert, '패스워드는 4자리 이상으로 입력해 주세요.');
          return false;
        } else {
          removeErrorMessage($signupAlert);
        }

        if(!confirmPassword()){
          showErrorMessage($signupAlert, '패스워드와 확인 패스워드가 다릅니다.');
          return false;
        } else {
          removeErrorMessage($signupAlert);
        }

        return true;
      };

      // username & password 체크에 실패한 경우, 서버에 인증을 요청하지 않는다.
      if(!checkForm()) return;

      // 서버에 신규 사용자 등록을 요청한다.
      $.ajax({
          method: "POST",
          url: "/auth/signup",
          data: $signupForm.serialize()
        })
        .done(function(data){
          if(data && data.result){
            // 신규 사용자 등록 성공
            window.location.href = "/";
          }else{
            // 신규 사용자 등록 실패
            showErrorMessage($signupAlert, data.msg);
          }
        })
        .fail(function(err) {
          throw new Error("Signup failed", err);
        });
    });
  };

  return {
    init: function() {
      handleSignin();
      handleSignup();
    }
  };
}();

$(function(){
  Signin.init();
});
