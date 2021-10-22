import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import rootReducer, { rootSaga } from './modules';
import { tempSetUser, check } from './modules/user';

const sagaMiddleware = createSagaMiddleware(); // 리덕스 사가 실행해서 변수에 담음
const store = createStore(
  rootReducer, // rootReducer에는 combineReducers에 의해 auth, loading, user 스테이트가 담김
  composeWithDevTools(applyMiddleware(sagaMiddleware)), // 크롬 플러그인 쓸수있게 설정
);

function loadUser() {
  try {
    const user = localStorage.getItem('user'); // 브라우저의 로컬스토리지의 user를 찾아서 user변수에 넣음
    if (!user) return; // 로그인 상태가 아니라면 아무것도 안함

    store.dispatch(tempSetUser(user)); // 위에서 얻은 user를 담아서 디스페치 ->
    store.dispatch(check());
  } catch (e) {
    console.log('localStorage is not working');
  }
}

sagaMiddleware.run(rootSaga);
loadUser();

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root'),
);

serviceWorker.unregister();
