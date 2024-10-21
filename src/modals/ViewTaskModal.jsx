import { useDispatch, useSelector } from "react-redux";
import { setActiveModal } from "../features/slices/dummyDataSlice";
import Status from "../components/Status";
import EditOrDeleteModal from "./EditOrDeleteModal";
import { useState } from "react";
import { toggleSubtask } from "../firebase/firebaseDb";

function ViewTaskModal() {
  const { selectedTask, isDarkMode } = useSelector((store) => store.boards);
  const dispatch = useDispatch();
  const [showEditDelete, setShowEditDelete] = useState(false);

  const { subtasks, description, title, status } = selectedTask;

  const completed = subtasks.filter((task) => task.isCompleted === true);

  function handleChange(e) {
    const clicked = subtasks.filter((task) => task.title === e.target.name);
    dispatch(toggleSubtask(clicked[0]));
  }

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <header
          className="text-left text-[19px]"
          onClick={() => setShowEditDelete(false)}
        >
          {title}
        </header>
        <button onClick={() => setShowEditDelete(true)}>
          <img
            src="/assets/icon-vertical-ellipsis.svg"
            alt="icon-vertical-ellipsis"
          />
        </button>

        {showEditDelete && (
          <div className="right-1 absolute  z-40 top-14 flex flex-col shadow-custom-dark rounded-lg">
            <EditOrDeleteModal
              type={"Task"}
              handleEdit={() => dispatch(setActiveModal("editTaskModal"))}
              handleDelete={() => dispatch(setActiveModal("deleteModal"))}
            />
          </div>
        )}
      </div>
      <p className="mt-6 text-[#828FA3] text-sm">{description}</p>
      <div onClick={() => setShowEditDelete(false)}>
        <p className="mt-6">{`Subtasks (${completed.length} of ${subtasks.length})`}</p>

        <div className="mt-4">
          {subtasks.map((subtask) => (
            <div
              key={subtask.title}
              className={`text-sm pt-[13px] pb-[16px] pr-2 pl-3  ${
                isDarkMode ? "bg-[#1A1A2A]" : "bg-[#E4EBFA]"
              } rounded-lg mb-2 flex gap-4 items-center  w-full ${
                subtask.isCompleted ? "text-gray-400" : ""
              }`}
            >
              <input
                type="checkbox"
                name={subtask.title}
                id={subtask.title}
                checked={
                  !!completed.find((task) => task.title === subtask.title)
                }
                onChange={handleChange}
              />
              <label htmlFor={subtask.title}>{subtask.title}</label>
            </div>
          ))}
        </div>

        <Status status={status} label={"Current Status"} />
      </div>
    </>
  );
}

export default ViewTaskModal;
