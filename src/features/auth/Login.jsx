import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import { useState } from "react";
import { validateLoginData } from "../../firebase/helpers";
import { toast } from "react-toastify";
import { loginUser } from "../../firebase/firebaseDb";
import Button from "../../components/Button";

function Login() {
  const { isDarkMode, isLoading } = useSelector((store) => store.boards);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loginErrors, setLoginErrors] = useState({ email: "", password: "" });
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validateLoginData(loginData);

    if (Object.keys(validationErrors).length > 0) {
      setLoginErrors(validationErrors);
      return;
    }

    if (!Object.keys(validationErrors).length > 0) {
      dispatch(loginUser(loginData.email, loginData.password)).then(
        (result) => {
          if (result.success) {
            navigate("/app");
            toast.success("Logged in successfully");
          }
        }
      );
    }
  }

  function handleChangeLogin(e) {
    const { name, value } = e.target;

    delete loginErrors[name];
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center flex-col w-full max-w-[400px] px-10">
      <div className="">
        {isDarkMode ? (
          <img src="./assets/logo-light.svg" alt="logo" />
        ) : (
          <img src="./assets/logo-dark.svg" alt="logo" />
        )}
      </div>
      <form className="mt-[30px]    w-full" noValidate onSubmit={handleSubmit}>
        <div>
          <h1 className="font-bold text-2xl text-white">Login</h1>
        </div>

        <div className="flex flex-col relative mt-[20px]">
          <label
            className={`  font-[400] text-[12px] leading-[18px]  text-white`}
          >
            Email address
          </label>
          <input
            type="email"
            className={`border py-[12px] pr-[16px] pl-[44px] rounded-[8px] mt-[4px] placeholder-opacity-[50%] focus:outline-none focus:border-[#633CFF] focus:shadow-xl ${
              loginErrors.email ? "border-[#FF3939]" : ""
            }`}
            placeholder="e.g. alex@email.com"
            value={loginData.email}
            name="email"
            onChange={handleChangeLogin}
          />
          <img
            src="/assets/email-icon.svg"
            className="absolute top-[41px] left-3"
          />
          {loginErrors.email && (
            <p className="text-[#FF3939] font-normal text-[12px] leading-[18px] absolute right-1 top-[39px]">
              {loginErrors.email}
            </p>
          )}
        </div>

        <div className="flex flex-col relative mt-[24px]">
          <label
            className={` font-[400] text-[12px] leading-[18px]  text-white `}
          >
            Password
          </label>
          <input
            type="password"
            className={`border py-[12px] pr-[16px] pl-[44px] rounded-[8px] mt-[4px] placeholder-opacity-[50%] focus:outline-none focus:border-[#633CFF] focus:shadow-xl  ${
              loginErrors.password ? "border-[#FF3939]" : ""
            }`}
            placeholder="Enter your password"
            value={loginData.password}
            name="password"
            onChange={handleChangeLogin}
          />
          <img
            src="/assets/lock-key.svg"
            className="absolute top-[40px] left-3"
          />
          {loginErrors.password && (
            <p className="text-[#FF3939] font-normal text-[12px] leading-[18px] absolute right-1 top-[39px]">
              {loginErrors.password}
            </p>
          )}
        </div>

        <Button className="bg-[#633CFF] text-white py-[11px] px-[27px] rounded-[8px]  mt-[24px]  font-semibold text-[16px] leading-[24px] w-full text-center">
          Login
        </Button>
      </form>

      <p className="text-center w-[200px] m-auto text-[16px] mt-[24px] text-white">
        Dont have an account?
        <Link to="/signup">
          <button className="text-[#633CFF]">Create account</button>
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

export default Login;
