import Theme from "./Theme";
import TaskList from "./TaskList";

function TaskListWithTheme() {
  return (
    <div className="flex flex-col justify-between h-full w-full">
      <TaskList />

      <div className="pl-4 w-full mt-4">
        <Theme />
      </div>
    </div>
  );
}

export default TaskListWithTheme;
