import Logo from "./Logo";

import { useDispatch, useSelector } from "react-redux";
import TaskListWithTheme from "./TaskListWithTheme";
import { setActiveModal } from "../features/slices/dummyDataSlice";
import EditOrDeleteModal from "../modals/EditOrDeleteModal";
import SettingsModal from "../modals/SettingsModal";

function Header() {
  const dispatch = useDispatch();
  const {
    selectedBoard,
    isSidebarOpen,
    activeModal,
    isDarkMode,
    boards,
    status,
  } = useSelector((store) => store.boards);

  return (
    <div
      className={`${
        isDarkMode ? "bg-[#2B2C37]" : "bg-white"
      }  flex items-center justify-between px-4 w-full  border-b-[1px] border-[#aba9a9]`}
    >
      <div className="flex items-center  ">
        <img src="./assets/logo-mobile.svg" alt="logo" className="md:hidden" />
        {!isSidebarOpen && <Logo />}

        <div
          className={`flex items-center gap-2 relative py-6  h-full  ${
            !isSidebarOpen ? "pl-6 ml-6 border-l" : ""
          }`}
        >
          <p
            className={` text-xl md:text-2xl font-[600]  ${
              isDarkMode ? "text-white" : "text-[#000112]"
            }`}
          >
            {boards.length > 0 ? selectedBoard.name : "Kaban"}
          </p>
          {
            <button
              className="md:hidden"
              onClick={() => dispatch(setActiveModal("taskListModal"))}
            >
              <img src="./assets/icon-chevron-down.svg" alt="icon-down" />
            </button>
          }
        </div>
      </div>

      <div className="flex items-center gap-4 py-5 relative">
        <div>
          <button
            className="w-14"
            onClick={() => dispatch(setActiveModal("settingsModal"))}
          >
            <img
              src="./assets/settings-icon-removebg-preview.png"
              alt="settings-icon"
              className=""
            />
          </button>
          {activeModal === "settingsModal" && <SettingsModal />}
        </div>
        <div className="flex items-center gap-4  relative">
          <button
            className="bg-[#635FC7] px-[18px] py-[10px] rounded-3xl"
            onClick={() => dispatch(setActiveModal("addNewTaskModal"))}
            disabled={
              !selectedBoard?.columns ||
              !Object.keys(selectedBoard).length > 0 ||
              !status
            }
          >
            <img
              src="./assets/icon-add-task-mobile.svg"
              alt="icon-add-task"
              className="md:hidden"
            />

            <p className="md:block hidden text-white">+Add New Task</p>
            {(!Object.keys(selectedBoard).length > 0 ||
              !selectedBoard?.columns ||
              !status) && (
              <div
                className={`absolute inset-0  opacity-50 ${
                  isDarkMode ? "bg-[#2B2C37] " : "bg-white"
                }`}
              ></div>
            )}
          </button>
          <button
            onClick={() => dispatch(setActiveModal("editOrDeleteBoardModal"))}
            disabled={
              !selectedBoard?.columns ||
              !Object.keys(selectedBoard).length > 0 ||
              !status
            }
          >
            <img
              src="./assets/icon-vertical-ellipsis.svg"
              alt="icon-vertical-ellipsis"
            />
          </button>

          {activeModal === "editOrDeleteBoardModal" && (
            <div className="right-1 absolute  z-40 top-14">
              <EditOrDeleteModal
                type="Board"
                handleEdit={() => dispatch(setActiveModal("editBoardModal"))}
                handleDelete={() => dispatch(setActiveModal("deleteModal"))}
              />
            </div>
          )}
        </div>
      </div>
      {activeModal === "taskListModal" && (
        <div className="absolute  top-[280px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 md:hidden cart w-full max-w-[264px]">
          <div
            className={`${
              isDarkMode ? "bg-[#2B2C37] " : " bg-white "
            } w-full rounded-xl pr-[13px] py-[16px] `}
          >
            <TaskListWithTheme />
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;

{
  /* <img
src="./assets/settings-light-removebg-preview.png"
alt="settings-icon"
className="w-10"
/> */
}
