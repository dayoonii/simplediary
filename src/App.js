import { useRef, useState } from "react";
import "./App.css";
import DiaryEditor from "./DiaryEditor";
import DiaryList from "./DiaryList.js";
import Lifecycle from "./Lifecycle";

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
    console.log(`${targetId}가 삭제되었습니다`);
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

  //렌더
  return (
    <div className="App">
      <Lifecycle />
      <DiaryEditor onCreate={onCreate} />
      <DiaryList onEdit={onEdit} onRemove={onRemove} diaryList={data} />
    </div>
  );
};

export default App;
