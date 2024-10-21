import { useSelector } from "react-redux";

function Button({ children, className = "", handleClick }) {
  const { isLoading, isDarkMode } = useSelector((store) => store.boards);
  return (
    <button
      className={` bg-[#635FC7] flex items-center justify-center py-[10px] px-[12px] rounded-3xl font-[500] text-lg ${className} relative`}
      onClick={handleClick}
      disabled={isLoading ? true : false}
    >
      {children}
      {isLoading && (
        <div
          className={`absolute inset-0  opacity-50 rounded-3xl ${
            isDarkMode ? "bg-[#2B2C37] " : "bg-white"
          }`}
        ></div>
      )}
    </button>
  );
}

export default Button;
