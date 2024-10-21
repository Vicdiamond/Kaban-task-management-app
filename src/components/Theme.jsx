import { useDispatch, useSelector } from "react-redux";
import { toggleDarkMode } from "../features/slices/dummyDataSlice";

function Theme() {
  const { isDarkMode } = useSelector((store) => store.boards);
  const dispatch = useDispatch();

  return (
    <div
      className={`flex items-center justify-center gap-[20px] rounded-lg px-[40px] py-[14px] w-full max-w-[235px]  ${
        isDarkMode ? "bg-[#000112]" : "bg-[#E4EBFA]"
      } `}
    >
      <img
        alt="sun-brigth"
        src={`./assets/icon-light-theme.svg`}
        className="w-[18px]"
      />

      <div
        className="bg-[#635fc7] h-5 w-full px-[3px] flex items-center relative rounded-full max-w-[40px]"
        onClick={() => dispatch(toggleDarkMode())}
        role="button"
      >
        {isDarkMode ? (
          <div className="bg-white h-3 w-3 rounded-full  animationSlide-slideOut absolute right-1"></div>
        ) : (
          <div className="bg-white h-3 w-3 rounded-full animate-slideIn absolute"></div>
        )}
      </div>

      <img
        alt="sun-dark"
        src={`./assets/icon-dark-theme.svg`}
        className="w-[18px]"
      />
    </div>
  );
}

export default Theme;
