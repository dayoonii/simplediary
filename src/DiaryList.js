import DiaryItem from "./DiaryItem";
//리스트 렌더링(조회)
const DiaryList = ({ onEdit, onRemove, diaryList }) => {
  return (
    <div className="DiaryList">
      <h2>일기 리스트</h2>
      <h4>{diaryList.length}개의 일기가 있습니다.</h4>
      <div>
        {diaryList.map((it) => (
          <DiaryItem key={it.id} {...it} onEdit={onEdit} onRemove={onRemove} />
        ))}
      </div>
    </div>
  );
};
//props를 따로 지정하지 않아도 기본 값으로 전달 해주는 props
DiaryList.defaultProps = {
  diaryList: [],
};

export default DiaryList;
