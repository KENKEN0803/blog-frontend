import { createAction, handleActions } from 'redux-actions';

const START_LOADING = 'loading/START_LOADING';
const FINISH_LOADING = 'loading/FINISH_LOADING';

/*
 요청을 위한 액션 타입을 payload로 설정합니다 (예: "sample/GET_POST")
*/

export const startLoading = createAction(
  START_LOADING,
  requestType => requestType,
);
// 액션 이름 정의, 페이로드 쓰겠다 설정

export const finishLoading = createAction(
  FINISH_LOADING,
  requestType => requestType,
);
// 액션 이름 정의, 페이로드 쓰겠다 설정

const initialState = {};

const loading = handleActions(
  {
    [START_LOADING]: (state, action) => ({
      ...state,
      [action.payload]: true,
    }),
    [FINISH_LOADING]: (state, action) => ({
      ...state,
      [action.payload]: false,
    }),
  },
  initialState,
);
// 액션에 따라 스테이트의 로딩 상태를 트루나 폴스로 변경. 끝

export default loading;
