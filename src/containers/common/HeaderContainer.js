import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../components/common/Header';
import { logout } from '../../modules/user';

const HeaderContainer = () => {
  const { user } = useSelector(({ user }) => ({ user: user.user }));
  //   컴바인 리듀서 써서 스토어 안에서 또 나눠지기 때문에 {user}로 값만 빼서 가져옴.
  const dispatch = useDispatch();
  const onLogout = () => {
    dispatch(logout());
  };
  return <Header user={user} onLogout={onLogout} />;
  // 유저 값을 헤더 컴포넌트에 전달. 로그아웃 함수도 전달
};

export default HeaderContainer;
