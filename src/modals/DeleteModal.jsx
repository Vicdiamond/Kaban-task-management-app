import { useDispatch, useSelector } from "react-redux";
import Button from "../components/Button";
import { setActiveModal } from "../features/slices/dummyDataSlice";
import {
  deleteBoardFromFirebase,
  deleteTaskFromFirebase,
  updateBoard,
} from "../firebase/firebaseDb";

function DeleteBoardModal() {
  const { selectedColumn, selectedBoard, selectedTask, isDarkMode } =
    useSelector((store) => store.boards);
  const dispatch = useDispatch();

  // console.log(selectedColumn);

  function handleDelete() {
    if (Object.keys(selectedColumn).length > 0) {
      dispatch(updateBoard());
    }

    if (Object.keys(selectedTask).length > 0) {
      dispatch(deleteTaskFromFirebase());
      return;
    }

    if (!Object.keys(selectedColumn).length > 0) {
      dispatch(deleteBoardFromFirebase());
    }
  }

  function handleCancel() {
    if (Object.keys(selectedColumn).length > 0) {
      dispatch(setActiveModal("editBoardModal"));
    }

    if (Object.keys(selectedTask).length > 0) {
      dispatch(setActiveModal("viewTaskModal"));
      return;
    }

    if (!Object.keys(selectedColumn).length > 0) {
      dispatch(setActiveModal("editOrDeleteBoardModal"));
    }
  }

  function generateMsg() {
    if (Object.keys(selectedColumn).length > 0)
      return `'${selectedColumn.name}' column?  This action will remove all tasks and subtasks and cannot be reversed`;

    if (Object.keys(selectedTask).length > 0)
      return `'${selectedTask.title}' task? This action will remove this task and subtasks and cannot be reversed`;

    if (!Object.keys(selectedColumn).length > 0)
      return `'${selectedBoard.name}' board? This action will remove all columns and tasks and cannot be reversed`;
  }

  const isSelectedColumn = Object.keys(selectedColumn).length > 0;
  const title =
    selectedBoard &&
    !Object.keys(selectedColumn).length > 0 &&
    !(Object.keys(selectedTask).length > 0);

  return (
    <div>
      <header className="text-red-400">
        Delete this
        {title ? " board" : isSelectedColumn ? " column" : " task"}?
      </header>
      <p className="mt-6 text-[#828FA3] text-sm">
        Are you sure you want to delete the {generateMsg()}
      </p>
      <div className="flex flex-col gap-4 mt-6 md:flex-row md:items-center">
        <Button
          className="bg-red-400 text-white w-full"
          handleClick={handleDelete}
        >
          Delete
        </Button>
        <Button
          className={`${
            isDarkMode ? "bg-white" : "bg-[#F4F7FD]"
          }  text-[#635FC7] w-full`}
          handleClick={handleCancel}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default DeleteBoardModal;
