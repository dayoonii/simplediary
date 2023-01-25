/* 
LifeCycle = react도 생명주기를 가짐,리액트는 기본적으로 lifecycle을 사용할 수 있는 메소드를 가짐
Class React Component Only
Mount(화면에 나타나는 것)탄생 ex)초기화 작업 ComponentDidMount
->Update(리렌더)변화 ex)예외 처리 작업 ComponentDidUpdate
->UnMount(화면에서 사라짐)죽음 ex)메모리 정리 작업  ComponentWillUnmount
React Hooks : use키워드를 붙여서 함수처럼 사용 가능 UseState, useEffect, useRef
useEffect는 리액트의 lifecycle을 제어하는 메소드를 훔쳐올 수 있는 기능을 가진 ReactHooks
 */
// callback함수, dependency Array(의존성 배열)-> 이 배열 내에 들어있는 값이 변화하면 콜백함수가 수행된다.
import React, { useEffect, useState } from "react";

const UnmountTest = () => {
  useEffect(() => {
    console.log("Mount!");

    return () => {
      //Unmount  시점에 실행되게 됨
      console.log("Unmount!");
    };
  }, []);

  return <div>Unmount Testing Component</div>;
};

const Lifecycle = () => {
  const [isVisible, setIsVisible] = useState(false);
  const toggle = () => setIsVisible(!isVisible);

  /* const [count, setCount] = useState(0);
  const [text, setText] = useState("");

  useEffect(() => {
    console.log("Mount!");
  }, []);

  //state가 변경되는 순간을 useEffect로 제어
  useEffect(() => {
    console.log("Update!");
  });

  //감지하고싶은 값만 감지해서 그 값이 변화하는 순간에만 콜백함수 수행할 수 있음
  useEffect(() => {
    console.log(`count is update : ${count}`);
    if (count > 5) {
      alert("count가 5를 넘었습니다 따라서 1로 초기화합니다");
      setCount(1);
    }
  }, [count]);

  useEffect(() => {
    console.log(`text is update : ${text}`);
  }, [text]);
 */
  return (
    <div style={{ padding: 20 }}>
      <button onClick={toggle}>ON/OFF</button>
      {isVisible && <UnmountTest />}
    </div>
    /* <div>
        {count}
        <button onClick={() => setCount(count + 1)}>+</button>
      </div>
      <div>
        <input value={text} onChange={(e) => setText(e.target.value)}></input>
      </div> */
  );
};

export default Lifecycle;
