import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect } from "react";
import {
  getDummyData,
  setActiveModal,
  setUserId,
} from "../features/slices/dummyDataSlice";

import BoardColumn from "../features/board/BoardColumn";
import EmptyBoard from "../features/board/EmptyBoard";
import ModePrompt from "../components/ModePrompt";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { getUserData } from "../firebase/firebaseDb";

function BoardLayout() {
  const dispatch = useDispatch();
  const { selectedBoard, isDarkMode, boards, status } = useSelector(
    (store) => store.boards
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUserId(user.uid));
      } else {
        dispatch(setUserId(""));
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [dispatch]);

  const fetchData = useCallback(() => {
    if (status === "demo") {
      dispatch(getDummyData());
    } else if (status === "complete") {
      dispatch(getUserData());
    }
  }, [dispatch, status]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div
      className={`pl-4 relative flex  ${
        isDarkMode ? "text-white" : "text-[#000112]"
      }  w-full  max-h-full  `}
    >
      <div className="flex w-full items-start">
        {status === "" && <ModePrompt />}
        {status === "complete" && boards.length === 0 && <EmptyBoard />}

        {status &&
          boards.length > 0 &&
          selectedBoard.columns.map((column, i) => (
            <BoardColumn key={i} column={column} index={i} />
          ))}

        {status && boards.length > 0 && (
          <button
            className={`flex rounded-lg px-[55.5px]  hover:text-[#635FC7] transition-colors duration-300 ${
              isDarkMode ? "bg-[#2B2C37]" : "bg-[#E4EBFA] "
            } text-nowrap h-screen w-full max-w-[280px] mt-[75px] items-center justify-center`}
            onClick={() => dispatch(setActiveModal("editBoardModal"))}
          >
            <p>+New Column</p>
          </button>
        )}
      </div>
    </div>
  );
}

export default BoardLayout;
