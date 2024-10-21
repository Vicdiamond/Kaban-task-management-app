import Button from "../components/Button";
import Status from "../components/Status";
import InputList from "../components/InputList-v1";
import { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateTask } from "../firebase/firebaseDb";

function AddNewTaskEditModal({ selectedTask, type }) {
  const { selectedBoard, selectedTask: activeTask } = useSelector(
    (store) => store.boards
  );
  const dispatch = useDispatch();

  // console.log(selectedBoard);

  const [input, setInput] = useState({
    title: selectedTask?.title ?? "",
    description: selectedTask?.description ?? "",
  });
  const { title, description } = input;

  const [newTask, setNewTask] = useState({
    title,
    description,
    status: selectedTask?.status ?? "",
    subtasks: selectedTask?.subtasks ?? [],
  });

  const [error, setError] = useState({
    title: "",
    subtaskId: [],
    subtask: "",
  });

  function handleChangeTitle(e) {
    setError(false);
    setInput((prevInput) => ({ ...prevInput, title: e.target.value }));
    setNewTask((prevTask) => ({ ...prevTask, title: e.target.value }));
  }
  function handleChangeDescription(e) {
    setInput((prevInput) => ({ ...prevInput, description: e.target.value }));
    setNewTask((prevTask) => ({ ...prevTask, description: e.target.value }));
  }

  function handleGetStatus(status) {
    setNewTask((prevTask) => ({ ...prevTask, status }));
  }

  const handleSubtasks = useCallback(
    (subtasks) => {
      const newSubTasks = subtasks.map((subtask) => ({
        ...subtask,
        isCompleted: false,
      }));

      setError((prevError) => ({
        ...prevError,
        subtask: "",
      }));

      newTask.subtasks = newSubTasks;
    },
    [newTask]
  );

  function checkTaskExists() {
    const taskExists = selectedBoard.columns
      .find((column) => newTask.status === column.name)
      .tasks.some((task) => task.title === newTask.title);

    return taskExists;
  }

  function handleCreateTask() {
    if (newTask.title === "") {
      setError((prevError) => ({
        ...prevError,
        title: "Task title cannot be empty",
      }));
      return;
    }

    if (newTask.subtasks.length === 0) {
      setError((prevError) => ({
        ...prevError,
        subtask: "subtasks cant be empty",
      }));
      return;
    }

    const emptySubtasks = newTask.subtasks.filter(
      (subtask) => subtask.title.trim() === ""
    );

    if (emptySubtasks.length > 0) {
      setError((prevError) => ({
        ...prevError,
        subtaskId: emptySubtasks.map((emptySubtask) => emptySubtask.id),
      }));
      return;
    }

    if (newTask.status === "") {
      newTask.status = selectedBoard.columns[0].name;
    }

    !selectedTask &&
      selectedBoard.columns.map((column) => {
        if (newTask.status === column.name) {
          column.tasks.map((task) => {
            if (task.title === newTask.title) {
              setError((prevError) => ({
                ...prevError,
                title: "Task already exist",
              }));
            }
          });
        }
      });

    if (Object.keys(activeTask).length) {
      if (activeTask.status !== newTask.status) {
        if (checkTaskExists()) {
          setError((prevError) => ({
            ...prevError,
            title: "Task exist in new destination",
          }));
        }
      }
    }

    if ((!selectedTask && !checkTaskExists()) || selectedTask) {
      dispatch(updateTask(selectedTask, newTask));
    }
  }

  const defaultValue = useMemo(() => [{ id: 1, title: "" }], []);
  const errorId = useMemo(() => error.subtaskId, [error.subtaskId]);

  return (
    <div>
      <header>{selectedTask ? "Edit Task" : "Add New Task"}</header>

      <div className="flex flex-col mt-6">
        <label>Title</label>
        <input
          className={`bg-transparent border rounded-md outline-none ${
            error.title ? "border-red-600" : "border-[#828FA3]"
          }  py-[9px] px-4 text-base mt-2`}
          placeholder="e.g Take coffee break"
          value={title}
          onChange={handleChangeTitle}
        />
        {error.title && <p className="text-red-600 text-xs">{error.title}</p>}
      </div>

      <div className="flex flex-col mt-6">
        <label>Description</label>
        <textarea
          className="bg-transparent border rounded-md outline-none border-[#828FA3] py-[8px] px-4 h-[112px] text-base mt-2"
          placeholder="e.g. It’s always good to take a break. This 15 minute break will  recharge the batteries a little."
          value={description}
          onChange={handleChangeDescription}
        />
      </div>

      <div className="flex flex-col mt-6">
        <InputList
          label="Subtasks"
          btnName="+ Add New Subtasks"
          defaultValue={selectedTask ? selectedTask.subtasks : defaultValue}
          type={type}
          handleGetArray={handleSubtasks}
          errorIds={errorId}
        />
        {error.subtask && (
          <p className="text-red-600 text-xs ml-2">{error.subtask}</p>
        )}
      </div>

      <div className="mt-6">
        <Status
          label={"Status"}
          status={selectedTask?.status}
          handleGetStatus={handleGetStatus}
        />
      </div>

      <div className="mt-6 ">
        <Button className="w-full text-white" handleClick={handleCreateTask}>
          {selectedTask ? "Save Changes" : " Create Task"}
        </Button>
      </div>
    </div>
  );
}

export default AddNewTaskEditModal;
