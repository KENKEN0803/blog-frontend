import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeField, initializeForm, register } from '../../modules/auth';
import AuthForm from '../../components/auth/AuthForm';
import { check } from '../../modules/user';
import { withRouter } from 'react-router-dom';

const RegisterForm = ({ history }) => {
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { form, auth, authError, user } = useSelector(({ auth, user }) => ({
    form: auth.register,
    auth: auth.auth,
    authError: auth.authError,
    user: user.user,
  }));

  /*
const rootReducer = combineReducers({
  auth,
  loading,
  user,
});
컴바인 리듀서 써서 스토어 안에서 또 나눠지기 때문에 {auth, user}로 빼서 가져옴.

auth 의 초기 상태 =
const initialState = {
register: {
    username: '',
    password: '',
    passwordConfirm: '',
},
login: {
   username: '',
   password: '',
},
  auth: null,
  authError: null,
};

user의 초기 상태 =
const initialState = {
user: null,
checkError: null,
};
 */

  // 인풋 변경 이벤트 핸들러
  const onChange = e => {
    // 입력값이 바뀔때마다 실행
    const { value, name } = e.target;
    // 이벤트 객체에서 벨류랑 네임만 디스트럭팅으로 뽑아냄
    dispatch(
      changeField({
        form: 'register',
        key: name,
        value,
      }),
    );
  };
// 폼의 값이 바뀔때 마다 리듀서의 체인지필드 액션이 실행돼서 스테이트 값이 바뀜


  // 폼 등록 이벤트 핸들러
  const onSubmit = e => {
    // 전송 버튼 눌렀을때 실행
    e.preventDefault();
    // 페이지 이동 방지
    const { username, password, passwordConfirm } = form;
    // 유즈셀렉터에서 가져온 form 안의 값을들 디스트럭팅으로 꺼냄

    // 하나라도 비어있다면
    if ([username, password, passwordConfirm].includes('')) {
      setError('빈 칸을 모두 입력하세요.');
      return;
    }
    // 비밀번호가 일치하지 않는다면
    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      changeField({ form: 'register', key: 'password', value: '' });
      changeField({ form: 'register', key: 'passwordConfirm', value: '' });
      return;
    }
    dispatch(register({ username, password }));
  };

  // 컴포넌트가 처음 렌더링 될 때 form 을 초기화함
  useEffect(() => {
    dispatch(initializeForm('register'));
  }, [dispatch]);

  // 회원가입 성공 / 실패 처리
  useEffect(() => {
    if (authError) {
      // 계정명이 이미 존재할 때
      if (authError.response.status === 409) {
        setError('이미 존재하는 계정명입니다.');
        return;
      }
      // 기타 이유
      setError('회원가입 실패');
      return;
    }

    if (auth) {
      console.log('회원가입 성공');
      console.log(auth);
      dispatch(check());
    }
  }, [auth, authError, dispatch]);

  // user 값이 잘 설정되었는지 확인
  useEffect(() => {
    if (user) {
      history.push('/'); // 홈 화면으로 이동
      try {
        localStorage.setItem('user', JSON.stringify(user));
      } catch (e) {
        console.log('localStorage is not working');
      }
    }
  }, [history, user]);

  return (
    <AuthForm
      type='register'
      form={form}
      onChange={onChange}
      onSubmit={onSubmit}
      error={error}
    />
    // /components/AuthForm 으로 위 함수 & 값들 전달
  );
};

export default withRouter(RegisterForm);
