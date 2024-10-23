import { useDispatch, useSelector } from "react-redux";
import Logo from "./Logo";

import TaskList from "./TaskList";
import Theme from "./Theme";
import { toggleSidebar } from "../features/slices/dummyDataSlice";

function Sidebar() {
  const dispatch = useDispatch();
  const { isDarkMode } = useSelector((store) => store.boards);

  return (
    <aside
      className={` w-full hidden md:flex flex-col items-start py-2 h-screen ${
        isDarkMode ? "bg-[#2B2C37]" : "bg-white"
      }  border-r-[1px] border-[#979797] sidebar md:col-span-2`}
    >
      <Logo />
      <div className=" mt-9 flex flex-col   justify-between h-full">
        <TaskList />
        <div className="px- w-full ml-4 ">
          <Theme />
          <button
            className="text-[#828FA3] mt-[30px] flex items-center gap-1 pl-2"
            onClick={() => dispatch(toggleSidebar())}
          >
            <img src="./assets/icon-hide-sidebar.svg" alt="" />
            Hide Sidebar
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
