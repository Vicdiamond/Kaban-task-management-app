import { useCallback, useState } from "react";
import Button from "../components/Button";
import InputList from "../components/InputList-v1";
import { useDispatch, useSelector } from "react-redux";
import { updateBoard } from "../firebase/firebaseDb";

const defalutArray = [
  { name: "Todo", id: 0, tasks: [] },
  { name: "Doing", id: 1, tasks: [] },
];

function AddNewBoardEditModal({ selectedBoard, type }) {
  const dispatch = useDispatch();
  const { boards } = useSelector((store) => store.boards);
  const [value, setValue] = useState(selectedBoard ? selectedBoard.name : "");
  const [newBoard, setNewBoard] = useState({ name: value, columns: [] });
  const [error, setError] = useState({ title: "", columns: "", columnsId: [] });

  function handleChange(e) {
    setError((prevError) => ({ ...prevError, title: "", columns: "" }));
    setValue(e.target.value);
    setNewBoard((prevBoard) => ({ ...prevBoard, name: e.target.value }));
  }

  const handleGetBoardColumns = useCallback((columns) => {
    setError((prevError) => ({
      ...prevError,
      columns: "",
    }));
    setNewBoard((prevBoard) => ({ ...prevBoard, columns }));
  }, []);

  function createNewBoard() {
    // check if board name is empty
    if (!newBoard.name) {
      setError((prevError) => ({
        ...prevError,
        title: "Board name cannot be empty",
      }));
      return;
    }

    // check if columns are empty
    if (newBoard.columns.length === 0) {
      setError((prevError) => ({
        ...prevError,
        columns: "columns cant be empty",
      }));

      return;
    }

    // check if columns have unique names
    const columnNames = newBoard.columns.map((col) => col.name.toLowerCase());
    const hasDuplicateNames = columnNames.some(
      (name, index) => columnNames.indexOf(name) !== index
    );

    if (hasDuplicateNames) {
      setError((prevError) => ({
        ...prevError,
        columns: "Column names must be unique",
      }));
      return;
    }

    // check if columns have empty names
    const emptyColumns = newBoard.columns.filter(
      (column) => column.name.trim() === ""
    );

    if (emptyColumns.length > 0) {
      setError((prevError) => ({
        ...prevError,
        columnsId: emptyColumns.map((emptyColumns) => emptyColumns.id),
      }));

      return;
    }

    // check if board name already exists
    !selectedBoard &&
      boards.map((board) => {
        if (newBoard.name.toLowerCase() === board.name.toLowerCase()) {
          setError((prevError) => ({
            ...prevError,
            title: "Board already exists",
          }));
        }
        return;
      });

    // check if board name already exists
    const boardExists = boards.some(
      (board) => board.name.toLowerCase() === newBoard.name.toLowerCase()
    );

    if ((!selectedBoard && !boardExists) || selectedBoard) {
      dispatch(updateBoard(selectedBoard, newBoard));
    }
  }

  return (
    <div>
      <header>{selectedBoard ? "Edit Board" : "Add New Board"}</header>

      <div className="mt-6">
        <label>Board Name</label>
        <input
          className={`bg-transparent  rounded-md w-full px-4 py-2 outline-none border ${
            error.title ? "border-red-600" : ""
          }`}
          placeholder="e.g Web Design"
          value={value}
          onChange={handleChange}
        />
        {error.title && <p className="text-red-600 text-xs">{error.title}</p>}
      </div>

      <div className="mt-6">
        <InputList
          label="Board Columns"
          btnName={"+Add New Column"}
          defaultValue={selectedBoard ? selectedBoard.columns : defalutArray}
          type={type}
          handleGetArray={handleGetBoardColumns}
          errorIds={error.columnsId}
        />

        {error.columns && (
          <p className="text-red-600 text-xs ml-2">{error.columns}</p>
        )}
      </div>

      <Button className="w-full mt-6 text-white" handleClick={createNewBoard}>
        {selectedBoard ? "Save Changes" : "Create New Board"}
      </Button>
    </div>
  );
}

export default AddNewBoardEditModal;
