import { useSelector } from "react-redux";
import ViewTaskModal from "../modals/ViewTaskModal";
import AddNewTaskEditModal from "../modals/AddNewTaskEditModal";
import AddNewBoardEditModal from "../modals/AddNewBoardEditModal";
import DeleteModal from "../modals/DeleteModal";
import ConfirmationModal from "../modals/ConfirmationModal";

function ModalLayout() {
  const { activeModal, selectedTask, selectedBoard } = useSelector(
    (store) => store.boards
  );

  //   console.log(selectedBoard);
  return (
    <div className={`$ rounded-xl px-[24px]`}>
      {activeModal === "viewTaskModal" && <ViewTaskModal />}

      {activeModal === "addNewTaskModal" && (
        <AddNewTaskEditModal type="newTask" />
      )}
      {activeModal === "editTaskModal" && (
        <AddNewTaskEditModal selectedTask={selectedTask} type="subtasks" />
      )}

      {activeModal === "addNewBoardModal" && (
        <AddNewBoardEditModal type="newColumn" />
      )}
      {activeModal === "editBoardModal" && (
        <AddNewBoardEditModal selectedBoard={selectedBoard} type="columns" />
      )}

      {activeModal === "deleteModal" && <DeleteModal />}

      {activeModal === "confirmationModal" && <ConfirmationModal />}
    </div>
  );
}

export default ModalLayout;
