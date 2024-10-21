import { useSelector } from "react-redux";

function EditOrDeleteModal({ type, handleEdit, handleDelete }) {
  const { isDarkMode } = useSelector((store) => store.boards);
  return (
    <div
      className={` ${
        isDarkMode ? "bg-[#2B2C37] text-white" : "bg-white text-[#000112]"
      } rounded-xl px-[15px] w-full py-2 shadow-2xl flex flex-col items-start`}
    >
      <button className={`  text-sm text-nowrap`} onClick={handleEdit}>
        Edit {type}
      </button>
      <button
        className="text-red-500 text-sm text-nowrap"
        onClick={handleDelete}
      >
        Delete {type}
      </button>
    </div>
  );
}

export default EditOrDeleteModal;
