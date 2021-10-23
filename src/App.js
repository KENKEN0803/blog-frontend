import React from 'react';
import { Route } from 'react-router-dom';
import PostListPage from './pages/PostListPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import WritePage from './pages/WritePage';
import PostPage from './pages/PostPage';

const App = () => {
  return (
    <>
      {/* 주소가 정확하게 일치하는 경우만 PostListPage 컴포넌트를 보여주고 안에서 username 파라메터를 받겠다. */}
      <Route component={PostListPage} path={['/@:username', '/']} exact />
      <Route component={LoginPage} path='/login' />
      <Route component={RegisterPage} path='/register' />
      <Route component={WritePage} path='/write' />
      {/* PostPage 컴포넌트 안에서 username 파라메터를 받겠다. */}
      <Route component={PostPage} path='/@:username/:postId' />
    </>
  );
};
export default App;
