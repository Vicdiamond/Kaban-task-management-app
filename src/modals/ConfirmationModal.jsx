import { useDispatch, useSelector } from "react-redux";
import Button from "../components/Button";
import { setActiveModal, setStatus } from "../features/slices/dummyDataSlice";
import { toast } from "react-toastify";
import { handleSignout } from "../firebase/firebaseDb";

export default function ConfirmationModal() {
  const { selectedAction, status, isDarkmode } = useSelector(
    (store) => store.boards
  );
  const dispatch = useDispatch();

  const handleClick = () => {
    if (selectedAction === "change mode") {
      const determineMode = status === "complete" ? "demo" : "complete";
      dispatch(setStatus(determineMode));
      toast.success(`Welcome to ${determineMode} mode`);
    }

    if (selectedAction === "signout") {
      dispatch(handleSignout());
    }
  };

  //   console.log(selectedAction);

  return (
    <div className="flex flex-col gap-4 items-center justify-center">
      <p>Are you sure to {selectedAction}</p>
      <div className="flex gap-2 w-full">
        <Button
          className="w-full  bg-[#E4EBFA]  text-red-500"
          handleClick={handleClick}
        >
          Yes
        </Button>
        <Button
          className={`${isDarkmode} w-full "`}
          handleClick={() => dispatch(setActiveModal("settingsModal"))}
        >
          No
        </Button>
      </div>
    </div>
  );
}
