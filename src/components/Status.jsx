import { useState } from "react";
import { useSelector } from "react-redux";

function Status({ status, label, handleGetStatus }) {
  const { selectedBoard, isDarkMode } = useSelector((store) => store.boards);
  // console.log(selectedBoard);

  const [input, setInput] = useState(status ?? selectedBoard?.columns[0].name);
  function handleChangeInput(e) {
    setInput(e.target.value);
    handleGetStatus(e.target.value);
  }

  return (
    <div className="flex flex-col items-start mt-6 relative">
      <label htmlFor="status">{label}</label>
      <select
        id="status"
        name="status"
        className={`w-full bg-transparent mt-2 border py-[9px] px-[16px] outline-none  ${
          isDarkMode ? "border-white" : "border-gray-400"
        } rounded-lg appearance-none`}
        value={input}
        onChange={handleChangeInput}
      >
        {selectedBoard.columns.map((column) => (
          <option value={column.name} key={column.name}>
            {column.name}
          </option>
        ))}
      </select>
      <img
        src="/assets/icon-chevron-down.svg"
        className="absolute right-4 bottom-[18px]"
        alt=""
      />
    </div>
  );
}

export default Status;
