import { useEffect, useState } from "react";
import Button from "./Button";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteSelectedSubtask,
  addSelectedSubtask,
  setActiveModal,
} from "../features/slices/dummyDataSlice";

function InputList({
  label,
  defaultValue = [{ id: 1, title: "" }],
  btnName,
  type,
  handleGetArray,
  errorIds,
}) {
  const dispatch = useDispatch();
  const { isDarkMode } = useSelector((store) => store.boards);

  const [array, setArray] = useState(defaultValue);

  // Adding ids to ease data manipulation
  useEffect(() => {
    const arrWithIds = defaultValue.map((arr, i) => ({ ...arr, id: i + 1 }));
    setArray(arrWithIds);
  }, [defaultValue]);

  useEffect(() => {
    // Getting the columns array
    handleGetArray(array);
  }, [type, array, handleGetArray]);

  function handleAddToArray() {
    if (type === "subtasks") {
      // Passed in the state of current subtask to keep in sync with the global state
      dispatch(addSelectedSubtask(array));
      return;
    }

    if (
      (type === "columns" && !!array.find((arr) => arr.tasks)) ||
      type === "newColumn"
    ) {
      setArray((prevSubtasks) => [
        ...prevSubtasks,
        {
          name: "",
          tasks: [],
          id:
            prevSubtasks.length > 0
              ? prevSubtasks[prevSubtasks.length - 1].id + 1
              : 1,
        },
      ]);

      return;
    }

    // For undefined
    setArray((prevSubtasks) => [
      ...prevSubtasks,
      {
        id:
          prevSubtasks.length > 0
            ? prevSubtasks[prevSubtasks.length - 1].id + 1
            : 1,
        title: "",
      },
    ]);
  }

  function handleDeleteFromArray(id, index, arr) {
    if (type === "subtasks") {
      dispatch(deleteSelectedSubtask(index));
      return;
    }

    if (type === "columns") {
      if (arr.name === "") {
        setArray((prevSubtasks) =>
          prevSubtasks.filter((subtask) => subtask.id !== id)
        );
      }

      if (arr.name) {
        // console.log(array.length);
        if (array.length > 1) {
          dispatch(setActiveModal("deleteModal", undefined, arr, array));
        }
      }
      return;
    }

    setArray((prevSubtasks) =>
      prevSubtasks.filter((subtask) => subtask.id !== id)
    );
  }

  function handleChangeInputArray(e, targetArr) {
    const targetObject = array.find((arr) => arr.id === targetArr.id);
    // setError(false);

    errorIds ? (errorIds.length = 0) : errorIds;

    if (type === "subtasks" || type === "newTask") {
      setArray((array) =>
        array.map((arr) =>
          arr.id === targetObject.id ? { ...arr, title: e.target.value } : arr
        )
      );
    }

    if (type === "columns" || type === "newColumn") {
      // console.log(array);
      setArray((array) =>
        array.map((arr) =>
          arr.id === targetObject.id ? { ...arr, name: e.target.value } : arr
        )
      );
    }
  }

  // console.log(array, type);
  // console.log(error, errorId);
  return (
    <>
      <label>{label}</label>
      <div className="flex items-start w-full justify-between  mt-2 flex-col">
        {array.map((arr, i) => (
          <div
            key={type === "subtasks" || type === "columns" ? i : arr.id}
            className={`flex w-full gap-4 mb-3 relative `}
          >
            <input
              className={`bg-transparent border rounded-md outline-none py-[9px] px-4  w-full  mb-2 ${
                errorIds?.length > 0 && errorIds?.includes(arr.id)
                  ? "border-red-600"
                  : "border-[#828FA3] "
              }`}
              placeholder="e.g Take coffee break"
              value={
                type === "subtasks" || type === "newTask"
                  ? arr.title
                  : type.includes("olumn")
                  ? arr.name
                  : ""
              }
              onChange={(e) => handleChangeInputArray(e, arr)}
            />
            <button onClick={() => handleDeleteFromArray(arr.id, i, arr)}>
              <img src="/assets/icon-cross.svg" alt="icon-cross" />
            </button>
            {errorIds?.length > 0 && errorIds?.includes(arr.id) && (
              <p className="absolute text-red-600 text-xs top-[14px] right-8">
                can`t be empty
              </p>
            )}
          </div>
        ))}
      </div>
      <Button
        className={` ${
          isDarkMode ? "bg-white" : "bg-[#F4F7FD]"
        } text-[#635FC7] text-2xl font-[600] w-full`}
        handleClick={handleAddToArray}
      >
        {btnName}
      </Button>
    </>
  );
}

export default InputList;
