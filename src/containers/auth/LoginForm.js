import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { changeField, initializeForm, login } from '../../modules/auth';
import AuthForm from '../../components/auth/AuthForm';
import { check } from '../../modules/user';

const LoginForm = ({ history }) => {
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const { form, auth, authError, user } = useSelector(({ auth, user }) => ({
    form: auth.login,
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
        form: 'login',
        key: name,
        value,
      }),
    );
  };
  // 폼의 값이 바뀔때 마다 리듀서의 체인지필드 액션이 실행돼서 스테이트 값이 바뀜


  // 폼 등록 이벤트 핸들러
  const onSubmit = e => {
    e.preventDefault();
    // 페이지 이동 방지

    const { username, password } = form;
    dispatch(login({ username, password }));
  };

  // 컴포넌트가 처음 렌더링 될 때 form 을 초기화함
  useEffect(() => {
    dispatch(initializeForm('login'));
  }, [dispatch]);

  useEffect(() => {
    if (authError) {
      console.log('오류 발생');
      console.log(authError);
      setError('로그인 실패');
      return;
    }
    if (auth) {
      console.log('로그인 성공');
      dispatch(check());
    }
  }, [auth, authError, dispatch]);

  useEffect(() => {
    if (user) {
      history.push('/');
      try {
        localStorage.setItem('user', JSON.stringify(user));
      } catch (e) {
        console.log('localStorage is not working');
      }
    }
  }, [history, user]);

  return (
    <AuthForm
      type='login'
      form={form}
      onChange={onChange}
      onSubmit={onSubmit}
      error={error}
    />
  );
};

export default withRouter(LoginForm);
