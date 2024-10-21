import { useDispatch } from "react-redux";
import Button from "../../components/Button";
import { setActiveModal } from "../slices/dummyDataSlice";

function EmptyBoard() {
  const dispatch = useDispatch();
  return (
    <div className="text-center max-w-[343px] w-full flex flex-col items-center gap-[25px] absolute top-[30vh] left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
      <p className="text-[#828FA3] font-[600] text-lg">
        This board is empty. Create a new board to get started.
      </p>
      <Button
        className="text-white"
        handleClick={() => dispatch(setActiveModal("addNewBoardModal"))}
      >
        <p>+Add New Board</p>
      </Button>
    </div>
  );
}

export default EmptyBoard;
