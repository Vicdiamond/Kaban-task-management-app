import { useSelector } from "react-redux";

function Logo() {
  const { isDarkMode } = useSelector((store) => store.boards);

  return (
    <div className="hidden md:flex h-full items-center pl-6  max-h-[80px] ">
      {isDarkMode ? (
        <img src="./assets/logo-light.svg" alt="logo" />
      ) : (
        <img src="./assets/logo-dark.svg" alt="logo" />
      )}
    </div>
  );
}

export default Logo;
