import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import rootReducer, { rootSaga } from './modules';
import { check, tempSetUser } from './modules/user';

// 리덕스 사가 만들고 변수에 담음
const sagaMiddleware = createSagaMiddleware();
// rootReducer에는 combineReducers에 의해 auth, loading, user 스테이트가 담김
const store = createStore(
  rootReducer,
  // 크롬에서 리덕스 디버깅 플러그인 쓸수있게 설정
  composeWithDevTools(applyMiddleware(sagaMiddleware)),
);

function loadUser() {
  try {
    // 브라우저의 로컬스토리지에서 user를 찾아서 user변수에 담음
    const user = localStorage.getItem('user');
    if (!user) return; // 로그인 상태가 아니라면 아무것도 안함

    // 방금 얻은 user를 담아서 디스페치 -> 위의 액션에 의해 리듀서의 스테이트에 user를 저장
    store.dispatch(tempSetUser(user));

    /*
    store.dispatch(tempSetUser(user)); 실행 흐름

    // tempSetUser의 액션 타입을 지정 'user/TEMP_SET_USER';
    const TEMP_SET_USER = 'user/TEMP_SET_USER';

    // 리듀서에 액션 등록, 페이로드 등록
    modules/user.js
    export const tempSetUser = createAction(TEMP_SET_USER, user => user);

    // 페이로드를 받아서 그대로 스테이트에 저장
    modules/user.js
     [TEMP_SET_USER]: (state, { payload: user }) => ({
      ...state,
      user,
    }),
     */

    // /api/auth/check 주소로 get요청을 보내고 응답 결과를 state에 저장.
    store.dispatch(check());

    /*
    store.dispatch(check()); 실행 흐름

    export const createRequestActionTypes = type => {
      const SUCCESS = `${type}_SUCCESS`;
      const FAILURE = `${type}_FAILURE`;
      return [type, SUCCESS, FAILURE];
  };

// 위 함수 리턴되는거 그대로 받아서 CHECK, CHECK_SUCCESS, CHECK_FAILURE에 넣음.

    // 리듀서 액션 등록
    modules/user.js
    export const check = createAction(CHECK);

    // authAPI는 아래의 check함수를 디폴트 익스포트한걸 받은것
    modules/user.js
    const checkSaga = createRequestSaga(CHECK, authAPI.check);

    // 로그인 상태 확인하는 GET요청 보냄. 이 때 토큰도 같이 보내진다(?)
    // lib/api/auth.js
    export const check = () => client.get('/api/auth/check');

  lib/createRequestSaga.js
  // 첫번째 인자로 타입(user/CHECK), 두번째 인자로 바로 위 check 함수 자체가 들어감.
  export default function createRequestSaga(type, request) {
  const SUCCESS = `${type}_SUCCESS`;
  const FAILURE = `${type}_FAILURE`;

  // 제네레이터 함수는 yield 붙은 작업이 끝나고, 호출을 해 주면 리턴값(객체로) 내뱉고 다음으로 진행함
  return function*(action) {
  // put은 dispatch와 동일
    yield put(startLoading(type)); // 로딩 시작
    try {
  // call은 함수의 첫 번째 파라미터는 함수, 나머지 파라미터는 해당 함수에 넣을 인수
  // request에 client.get('/api/auth/check');, action.payload는 null
      const response = yield call(request, action.payload);
      yield put({
        type: SUCCESS,
        payload: response.data
      });
    } catch (e) {
      yield put({
        type: FAILURE,
        payload: e,
        error: true
      });
    }
    yield put(finishLoading(type)); // 로딩 끝
  };
 }
*/

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
