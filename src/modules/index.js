import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects';
import auth, { authSaga } from './auth';
import loading from './loading';
import user, { userSaga } from './user';

const rootReducer = combineReducers({
  auth,
  loading,
  user,
});
// 각 파일에 흩어진 리듀서(handleActions) 합쳐줌


export function* rootSaga() {
  yield all([authSaga(), userSaga()]);
}
// yield all 은 제너레이터 함수들이 병행적으로 동시에 실행되고, 전부 resolve될때까지 기다린다.

export default rootReducer;
