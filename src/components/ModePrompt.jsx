import { useDispatch, useSelector } from "react-redux";
import { setStatus } from "../features/slices/dummyDataSlice";
import Button from "./Button";
import { toast } from "react-toastify";

function ModePrompt() {
  const { isDarkMode, status } = useSelector((store) => store.boards);
  const dispatch = useDispatch();

  if (status) {
    return null;
  }
  return (
    <div
      className={` absolute top-[30vh] left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-7 w-full max-w-[350px] rounded-lg  ${
        isDarkMode ? "bg-[#2B2C37] text-white" : "bg-white text-[#000112]"
      }
`}
    >
      <h1 className="mb-2">Hey there 👋</h1>
      <p>
        Would you like to explore the app with a quick Demo Mode, or jump right
        into the Full Experience?
      </p>
      <div className="flex items-center justify-center gap-4 mt-3">
        <Button
          className="text-lg text-nowrap w-[150px]   text-white"
          handleClick={() => {
            dispatch(setStatus("demo"));
            toast.success("Welcome to demo mode");
          }}
        >
          Demo Mode
        </Button>
        <Button
          className="text-nowrap w-[150px]  text-white"
          handleClick={() => {
            dispatch(setStatus("complete"));
            toast.success("Welcome to Full Experience");
          }}
        >
          Complete Mode
        </Button>
      </div>
    </div>
  );
}

export default ModePrompt;
