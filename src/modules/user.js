import { createAction, handleActions } from 'redux-actions';
import { call, takeLatest } from 'redux-saga/effects';
import * as authAPI from '../lib/api/auth';
import createRequestSaga, { createRequestActionTypes } from '../lib/createRequestSaga';

const TEMP_SET_USER = 'user/TEMP_SET_USER';

const [CHECK, CHECK_SUCCESS, CHECK_FAILURE] = createRequestActionTypes(
  'user/CHECK',
);
/*
export const createRequestActionTypes = type => {
  const SUCCESS = `${type}_SUCCESS`;
  const FAILURE = `${type}_FAILURE`;
  return [type, SUCCESS, FAILURE];
};
 */
// 위 함수 리턴되는거 그대로 받아서 CHECK, CHECK_SUCCESS, CHECK_FAILURE에 넣음.

const LOGOUT = 'user/LOGOUT';

export const tempSetUser = createAction(TEMP_SET_USER, user => user);
export const check = createAction(CHECK);
export const logout = createAction(LOGOUT);
// 어떤 액션명으로 사용할지 등록, 페이로드 쓸거다 하고 등록.

const checkSaga = createRequestSaga(CHECK, authAPI.check); // 서버에다가 요청을 보냄
/*
// const checkSaga = createRequestSaga(CHECK, authAPI.check) 실행 흐름

// 첫번째 인자로 타입(user/CHECK), 두번째 인자로 바로 위 check 함수 자체가 들어감.
export default function createRequestSaga(type, request) {
  const SUCCESS = `${type}_SUCCESS`;
  const FAILURE = `${type}_FAILURE`;

  // 제네레이터 함수는 yield 붙은 작업이 끝나고, 호출을 해 주면 리턴값 내뱉고 다음으로 진행함
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

function checkFailureSaga() {
  try {
    localStorage.removeItem('user'); // localStorage 에서 user 제거하고
  } catch (e) {
    console.log('localStorage is not working');
  }
}

function* logoutSaga() {
  try {
    yield call(authAPI.logout); // logout API 호출
    // 끝날때 까지 기다렸다 아랫줄 실행
    localStorage.removeItem('user'); // localStorage 에서 user 제거
  } catch (e) {
    console.log(e);
  }
}
// authAPI는 export const logout = () => client.post('/api/auth/logout');

export function* userSaga() {
  yield takeLatest(CHECK, checkSaga); // 체크를 기다림 const checkSaga = createRequestSaga(CHECK, authAPI.check);
  yield takeLatest(CHECK_FAILURE, checkFailureSaga);
  yield takeLatest(LOGOUT, logoutSaga);
}
// takeLastes 는 첫번째 파라메타로 액션, 두번째 파라메타로 함수를 받음.
// 기존에 진행 중이던 작업이 있다면 취소 처리하고 가장 마지막으로 실행된 작업만 수행한다.
// 응답이 아직 안왔는데 또 버튼을 누르는것을 방지할 수 있다. 요청이 중복돼서 날아가는것을 방지.

const initialState = {
  user: null,
  checkError: null,
};
// 스테이트 초기값 설정

export default handleActions(
  {
    [TEMP_SET_USER]: (state, { payload: user }) => ({
      ...state,
      user,
    }),
    [CHECK_SUCCESS]: (state, { payload: user }) => ({
      ...state,
      user,
      checkError: null,
    }),
    [CHECK_FAILURE]: (state, { payload: error }) => ({
      ...state,
      user: null,
      checkError: error,
    }),
    [LOGOUT]: state => ({
      ...state,
      user: null,
    }),
  },
  initialState,
);
// 4개 액션 모두 단순히 수행결과를 스테이트에 넣는 리듀서.