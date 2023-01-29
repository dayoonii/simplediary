import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import "./App.css";
import DiaryEditor from "./DiaryEditor";
import DiaryList from "./DiaryList.js";
//import OptimizeTest from "./OptimizeTest";
//import Lifecycle from "./Lifecycle";

/* dummyList 데이터 */
/* const dummyList = [
  {
    id: 1,
    author: "정다윤",
    content: "안녕11",
    emotion: 5,
    create_date: new Date().getTime(),
  },

  {
    id: 2,
    author: "이재현",
    content: "안녕22",
    emotion: 2,
    create_date: new Date().getTime(),
  },

  {
    id: 3,
    author: "이주연",
    content: "안녕33",
    emotion: 4,
    create_date: new Date().getTime(),
  },
];
 */

/* 상태 변화 처리 함수 
const [data,setData] = useState();
onCreate : 데이터 생성 상태 변화 로직 
onEdit : 데이터 수정 상태 변화 로직
onRemove : 데이터삭제 상태 변화로직 

컴포넌트에서 상태변화 로직을 분리하자 
useReducer는  useState를 대체할 수 있는 함수  */
const reducer = (state, action) => {
  switch (action.type) {
    case "INIT": {
      return action.data;
    }
    case "CREATE": {
      const create_date = new Date().getTime();
      const newItem = {
        ...action.data,
        create_date,
      };
      return [newItem, ...state];
    }
    case "REMOVE": {
      return state.filter((it) => it.id !== action.targetId);
    }
    case "EDIT": {
      return state.map((it) =>
        it.id === action.targetId ? { ...it, content: action.newContent } : it
      );
    }
    default:
      return state;
  }
};

/* 
컴포넌트 트리에 데이터 공급하기 context 
provider컴포넌트로 깔끔하게 정리할 수 있음 
context 생성
const MyContext = React.createContext(defaultValue);
-> Context Provider를 통한 데이터 공급 
<MyCounter.Provider value={전역으로 전달하고자 하는 값}>
{//이 context안에 위치할 자식 컴포넌트들}
</MyContext.Provider>
*/
export const DiaryStateContext = React.createContext();

export const DiaryDispatchContext = React.createContext();

const App = () => {
  //const [data, setData] = useState([]);

  const [data, dispatch] = useReducer(reducer, []);

  const dataId = useRef(0);

  //API 호출 -> data 값 가져오기
  const getData = async () => {
    const res = await fetch(
      "https://jsonplaceholder.typicode.com/comments"
    ).then((res) => res.json());

    const initData = res.slice(0, 20).map((it) => {
      return {
        author: it.email,
        content: it.body,
        emotion: Math.floor(Math.random() * 5) + 1, // 5로 써도 ㄱㅊ
        create_date: new Date().getTime(),
        id: dataId.current++,
      };
    });
    dispatch({ type: "INIT", data: initData });
  };

  useEffect(() => {
    getData();
  }, []);

  // data에 새로운 일기를 추가하는 함수
  const onCreate = useCallback((author, content, emotion) => {
    dispatch({
      type: "CREATE",
      data: { author, content, emotion, id: dataId.current },
    });
    dataId.current += 1;
  }, []);

  //데이터 삭제하기
  const onRemove = useCallback((targetId) => {
    dispatch({ type: "REMOVE", targetId });
  }, []);

  //수정하기
  const onEdit = useCallback((targetId, newContent) => {
    dispatch({ type: "EDIT", targetId, newContent });
  }, []);

  //onCreate, onRemove, onEdit 한번에 묶기
  const memoizedDispatches = useMemo(() => {
    return { onCreate, onRemove, onEdit };
  }, []);

  /* 최적화1
useMemo 연산결과를 재사용하는 방법  
Memoization : 이미 계산 해 본 연산 결과를 기억해 두었다가
동일한 계산을 시키면, 다시 연산하지 않고 기억해 두었던 데이터를 변환 시키게 하는 방법
-> 마치 시험을 볼 때, 이미 풀어본 문제는 다시 풀어보지 않아도 답을 알고 있는 것과 유사함 
ex)문제  A
상황 : 처음 만난 문제
해결방법 : 할 수 있는 모든 방법을 시도해 본다.
해결 이후 : 답을 기억해 둔다. 
-> 상황 : 이전에 풀어 본 경험이 있는 문제 
해결방법 : 기억해 두었던 답을 다시 적는다.
 = 이런상황을 Memoization을 이용한 연산 과정 최적화 
  */
  const getDiaryAnalysis = useMemo(() => {
    const goodCount = data.filter((it) => it.emotion >= 3).length;
    const badCount = data.length - goodCount;
    const goodRatio = (goodCount / data.length) * 100;
    return { goodCount, badCount, goodRatio };
  }, [data.length]);

  const { goodCount, badCount, goodRatio } = getDiaryAnalysis;

  //렌더
  return (
    <DiaryStateContext.Provider value={data}>
      <DiaryDispatchContext.Provider value={memoizedDispatches}>
        <div className="App">
          {/*    <Lifecycle /> */}
          {/*   <OptimizeTest /> */}
          <DiaryEditor />
          <div>전체 일기 : {data.length} </div>
          <div>기분 좋은 일기 개수 : {goodCount} </div>
          <div>기분 나쁜 일기 개수 : {badCount}</div>
          <div>기분 좋은 일기 비율 : {goodRatio} </div>
          <DiaryList />
        </div>
      </DiaryDispatchContext.Provider>
    </DiaryStateContext.Provider>
  );
};

export default App;
