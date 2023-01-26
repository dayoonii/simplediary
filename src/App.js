import { useEffect, useMemo, useRef, useState } from "react";
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

const App = () => {
  const [data, setData] = useState([]);

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
    setData(initData);
  };

  useEffect(() => {
    getData();
  }, []);

  // data에 새로운 일기를 추가하는 함수
  const onCreate = (author, content, emotion) => {
    const create_date = new Date().getTime();
    const newItem = {
      author,
      content,
      emotion,
      create_date,
      id: dataId.current,
    };
    dataId.current += 1;
    setData([newItem, ...data]);
  };
  //데이터 삭제하기
  const onRemove = (targetId) => {
    const newDiaryList = data.filter((it) => it.id !== targetId);
    setData(newDiaryList);
  };

  //수정하기
  const onEdit = (targetId, newContent) => {
    setData(
      data.map((it) =>
        it.id === targetId ? { ...it, content: newContent } : it
      )
    );
  };

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
    <div className="App">
      {/*    <Lifecycle /> */}
      {/*   <OptimizeTest /> */}
      <DiaryEditor onCreate={onCreate} />
      <div>전체 일기 : {data.length} </div>
      <div>기분 좋은 일기 개수 : {goodCount} </div>
      <div>기분 나쁜 일기 개수 : {badCount}</div>
      <div>기분 좋은 일기 비율 : {goodRatio} </div>
      <DiaryList onEdit={onEdit} onRemove={onRemove} diaryList={data} />
    </div>
  );
};

export default App;
