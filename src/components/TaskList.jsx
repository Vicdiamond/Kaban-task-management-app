import { useDispatch, useSelector } from "react-redux";
import BoardTitle from "../features/board/BoardTitle";
import { changeBoard, setActiveModal } from "../features/slices/dummyDataSlice";

function TaskList() {
  const { boards, isLoading, status } = useSelector((store) => store.boards);
  const dispatch = useDispatch();

  function handleChangeBoard(index, board) {
    dispatch(changeBoard(index, board));
  }

  function handleNewBoard() {
    dispatch(setActiveModal("addNewBoardModal"));
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col w-full mr-20">
      <p className="text-[#828FA3]  pl-6 mb-[19px]">
        {boards.length > 0 ? "All Boards" : "No Boards Yet"}
      </p>

      {boards.length > 0 &&
        boards.map((board, i) => (
          <BoardTitle
            key={board.name}
            board={board}
            index={i}
            handleClick={handleChangeBoard}
          >
            {board.name}
          </BoardTitle>
        ))}

      {status && (
        <BoardTitle
          className={"text-[#635fc7] text-nowrap"}
          handleClick={handleNewBoard}
        >
          +Create New Board
        </BoardTitle>
      )}
    </div>
  );
}

export default TaskList;
