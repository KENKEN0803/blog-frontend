import { call, put } from 'redux-saga/effects';
import { finishLoading, startLoading } from '../modules/loading';

// 이런건 그냥 하드코딩하지 ㅅㅂ
export const createRequestActionTypes = type => {
  const SUCCESS = `${type}_SUCCESS`;
  const FAILURE = `${type}_FAILURE`;
  return [type, SUCCESS, FAILURE];
};

export default function createRequestSaga(type, request) {
  const SUCCESS = `${type}_SUCCESS`;
  const FAILURE = `${type}_FAILURE`;

  return function* (action) {
    yield put(startLoading(type)); // 로딩 시작
    try {
      const response = yield call(request, action.payload);
      yield put({
        type: SUCCESS,
        payload: response.data,
      });
    } catch (e) {
      yield put({
        type: FAILURE,
        payload: e,
        error: true,
      });
    }
    yield put(finishLoading(type)); // 로딩 끝
  };
}

/*
    store.dispatch(check()); 실행 흐름

    // CHECK의 엑션 타입은 'user/CHECK'
    modules/user.js
    const [CHECK, CHECK_SUCCESS, CHECK_FAILURE] = createRequestActionTypes(
    'user/CHECK',
    );

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

  // 제네레이터 함수는 yield 붙은 작업이 끝나고, 호출을 해 주면 리턴값 내뱉고 다음으로 진행함
  return function*(action) {
  // put은 dispatch와 동일
    yield put(startLoading(type)); // 로딩 시작
    try {
  // call은 함수의 첫 번째 파라미터는 함수, 나머지 파라미터는 해당 함수에 넣을 인수
  // request에 client.get('/api/auth/check');, action.payload는 CHECK, CHECK_SUCCESS, CHECK_FAILURE중 하나
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