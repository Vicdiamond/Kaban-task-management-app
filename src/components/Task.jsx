import { useSelector } from "react-redux";

function Task({ title, task, handleClick, index }) {
  const completed = task.subtasks.filter((task) => task.isCompleted === true);

  const { isDarkMode } = useSelector((store) => store.boards);

  return (
    <div
      role="button"
      className={`py-[23px] px-[16px] w-[280px] ${
        isDarkMode ? "bg-[#2B2C37]" : "bg-white"
      } mb-[20px] rounded-xl shadow-md  drop-shadow-purple flex flex-col flex-wrap hover:text-[#635FC7] transition-colors duration-300`}
      onClick={() => handleClick(task, index)}
    >
      <header>{title}</header>
      <p className="text-[#828FA3] text-xs mt-2">
        {`${completed.length} of ${task.subtasks.length}`} subtasks
      </p>
    </div>
  );
}

export default Task;
