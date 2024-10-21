import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Loader from "../../components/Loader";
import { useState } from "react";
import { toast } from "react-toastify";
import { validateLoginData } from "../../firebase/helpers";
import { handleCreateAccount } from "../../firebase/firebaseDb";

function CreateAccount() {
  const { isDarkMode, isLoading } = useSelector((store) => store.boards);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [createAccountData, setCreateAccountData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validateLoginData(createAccountData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!Object.keys(validationErrors).length > 0) {
      dispatch(
        handleCreateAccount(createAccountData.email, createAccountData.password)
      ).then((result) => {
        if (result.success) {
          navigate("/app");
          toast.success("logged in successfully");
          // console.log("working");
        }
      });
    }
  }

  function handleChangeLogin(e) {
    const { name, value } = e.target;

    delete errors[name];
    setCreateAccountData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[400px]  flex  flex-col pt-20 px-10 items-center ">
      <div className="mb-5">
        {isDarkMode ? (
          <img src="./assets/logo-light.svg" alt="logo" />
        ) : (
          <img src="./assets/logo-dark.svg" alt="logo" />
        )}
      </div>

      <form
        className="mt-[10px] md:mt-0 w-full"
        onSubmit={handleSubmit}
        noValidate
      >
        <div>
          <h1 className="font-bold text-2xl text-white">Create account</h1>
        </div>
        <div className="flex flex-col relative mt-[14px]">
          <label className=" font-[400] text-[12px] leading-[18px] text-white">
            Email address
          </label>
          <input
            type="email"
            name="email"
            className={`border py-[12px] pr-[16px] pl-[44px] rounded-[8px] mt-[4px] placeholder-opacity-[50%] focus:outline-none focus:border-[#633CFF] focus:shadow-xl  ${
              errors.email ? "border-[#FF3939]" : ""
            }`}
            placeholder="e.g. alex@email.com"
            value={createAccountData.email}
            onChange={handleChangeLogin}
          />
          <img
            src="assets/email-icon.svg"
            className="absolute top-[41px] left-3"
          />
          {errors.email && (
            <p className="text-[#FF3939] font-normal text-[12px] leading-[18px] absolute right-1 top-[39px]">
              {errors.email}
            </p>
          )}
        </div>

        <div className="flex flex-col relative mt-[14px]">
          <label className="text-white font-[400] text-[12px] leading-[18px]">
            Create password
          </label>
          <input
            type="password"
            className={`border py-[12px] pr-[16px] pl-[44px] rounded-[8px] mt-[4px] placeholder-opacity-[50%] focus:outline-none focus:border-[#633CFF] focus:shadow-xl  ${
              errors.password ? "border-[#FF3939]" : ""
            }`}
            placeholder="At least 8 characters"
            value={createAccountData.password}
            name="password"
            onChange={handleChangeLogin}
          />
          <img
            src="assets/lock-key.svg"
            className="absolute top-[40px] left-3"
          />
          {errors.password && (
            <p className="text-[#FF3939] font-normal text-[12px] leading-[18px] absolute right-1 top-[39px]">
              {errors.password}
            </p>
          )}
        </div>

        <div className="flex flex-col relative mt-[14px] ">
          <label className="text-white font-[400] text-[12px] leading-[18px]">
            Confirm password
          </label>
          <input
            type="password"
            className={`border py-[12px] pr-[16px] pl-[44px] rounded-[8px] mt-[4px] placeholder-opacity-[50%] focus:outline-none focus:border-[#633CFF] focus:shadow-xl  ${
              errors.confirmPassword ? "border-[#FF3939]" : ""
            }`}
            placeholder="At least 8 characters"
            value={createAccountData.confirmPassword}
            name="confirmPassword"
            onChange={handleChangeLogin}
          />
          <img
            src="assets/lock-key.svg"
            className="absolute top-[40px] left-3"
          />
          {errors.confirmPassword && (
            <p className="text-[#FF3939] font-normal text-[12px] leading-[18px] absolute right-1 top-[39px]">
              {errors.confirmPassword}
            </p>
          )}
        </div>
        <p className="text-white font-[400] text-[12px] leading-[18px] mt-[14px] mb-[24px]">
          Password must contain at least 8 characters
        </p>
        <button className="bg-[#633CFF] text-white py-[11px] px-[27px] rounded-[8px] font-semibold text-[16px] leading-[24px] w-full text-center">
          Create new account
        </button>
      </form>

      <p className="text-center w-[200px] m-auto text-[16px] mt-[14px] text-white">
        Already have an account?
        <Link to="/login">
          <button className="text-[#633CFF]">Login</button>
        </Link>
      </p>

      {isLoading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Loader />
        </div>
      )}
    </div>
  );
}

export default CreateAccount;
