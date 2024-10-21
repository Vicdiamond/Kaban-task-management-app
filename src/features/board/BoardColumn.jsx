import { useDispatch } from "react-redux";
import Task from "../../components/Task";
import { setActiveModal, setColumnIndex } from "../slices/dummyDataSlice";

function BoardColumn({ column, index }) {
  const dispatch = useDispatch();

  function handleClick(task, index) {
    dispatch(setColumnIndex(index));
    dispatch(setActiveModal("viewTaskModal", task));
  }

  // console.log(column.tasks);
  const headerColors = [
    "bg-[#49C4E5]",
    "bg-[#8471F2]",
    "bg-[#67E2AE]",
    "bg-[#635FC7]",
    "bg-[#A8A4FF]",
  ];

  return (
    <div className="mr-[24px] my-6 ml-4">
      <div className="mb-6 flex items-center gap-2">
        <div className={`${headerColors[index]} w-4 h-4 rounded-full`}></div>
        <header className="text-nowrap">{`${column.name} (${column.tasks.length})`}</header>
      </div>

      {column.tasks.map((task, i) => (
        <Task
          key={task.title}
          title={task.title}
          task={task}
          handleClick={handleClick}
          index={i}
        />
      ))}
    </div>
  );
}

export default BoardColumn;
