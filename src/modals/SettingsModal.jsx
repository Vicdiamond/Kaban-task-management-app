import { useDispatch, useSelector } from "react-redux";
import { setActiveModal } from "../features/slices/dummyDataSlice";

export default function SettingsModal() {
  const { isDarkMode } = useSelector((store) => store.boards);
  const dispatch = useDispatch();

  return (
    <div
      className={`${
        isDarkMode ? "bg-[#2B2C37]" : "bg-white "
      }  left-[1px] absolute z-40 top-14 rounded-xl px-[10px] w-full py-2 shadow-2xl flex flex-col items-start text-sm gap-1`}
    >
      <button
        className="text-white"
        onClick={() =>
          dispatch(
            setActiveModal(
              "confirmationModal",
              undefined,
              undefined,
              undefined,
              "change mode"
            )
          )
        }
      >
        Change Mode
      </button>
      <button
        className="text-red-500"
        onClick={() =>
          dispatch(
            setActiveModal(
              "confirmationModal",
              undefined,
              undefined,
              undefined,
              "signout"
            )
          )
        }
      >
        Signout
      </button>
    </div>
  );
}
