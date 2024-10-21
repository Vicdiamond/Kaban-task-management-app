import { useDispatch, useSelector } from "react-redux";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import BoardLayout from "./BoardLayout";
import {
  setActiveModal,
  toggleSidebar,
} from "../features/slices/dummyDataSlice";
import ModalLayout from "./ModalLayout";
import Loader from "../components/Loader";

const lists = ["taskListModal", "editOrDeleteBoardModal", "settingsModal"];

function AppLayout() {
  const dispatch = useDispatch();
  const { isSidebarOpen, activeModal, isDarkMode, isLoading } = useSelector(
    (store) => store.boards
  );

  return (
    <div className="md:flex plus-jakarta-sans-body relative">
      {isSidebarOpen && <Sidebar />}
      <div className="w-full relative flex flex-col">
        <Header />
        <div className="pt-3  overflow-hidden  h-[85vh] pr-3 pl-3">
          <div className="overflow-auto h-full">
            <BoardLayout />
          </div>
        </div>
      </div>

      {!isSidebarOpen && (
        <button
          className="hidden  md:flex items-center justify-center absolute w-14 h-12 bg-[#635FC7]  z-50  bottom-36 rounded-e-3xl "
          onClick={() => dispatch(toggleSidebar())}
        >
          <img
            src="./assets/icon-show-sidebar.svg"
            alt="icon-show-sidebar"
            className="w-4"
          />
        </button>
      )}

      {activeModal && lists.includes("taskListModal") && (
        <div
          className="inset-0 bg-black bg-opacity-50 z-20 fixed"
          onClick={() => dispatch(setActiveModal(""))}
        ></div>
      )}

      {activeModal && !lists.includes(activeModal) && (
        <div
          className={`absolute top-[300px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-[343px]  py-6  ${
            isDarkMode ? "bg-[#2B2C37] text-white" : "bg-white text-[#000112]"
          }   rounded-xl`}
        >
          <div className="overflow-y-auto max-h-[500px]">
            <ModalLayout />
          </div>
        </div>
      )}

      {isLoading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <Loader />
        </div>
      )}
    </div>
  );
}

export default AppLayout;
