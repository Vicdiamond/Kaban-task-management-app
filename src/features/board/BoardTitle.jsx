import { useSelector } from "react-redux";

function BoardTitle({ children, className, board, index, handleClick }) {
  const { active, isDarkMode } = useSelector((store) => store.boards);
  return (
    <button
      className={`max-w-[240px] py-[15px] pl-[23px] rounded-r-3xl text-[#828FA3] flex items-center gap-3 w-full hover:text-[#635FC7] transition-colors duration-300 ${
        isDarkMode && active !== index
          ? "hover:bg-white transition-colors"
          : "hover:bg-[#A8A4FF]"
      } ${active === index ? "active hover:text-white" : ""} ${className}`}
      onClick={() => handleClick(index, board)}
    >
      <img
        src={
          active === index
            ? "./assets/icon-board-dark.png"
            : children.includes("+")
            ? "./assets/icon-board-new.png"
            : "./assets/icon-board.svg"
        }
        alt=""
      />

      {children}
    </button>
  );
}

export default BoardTitle;
