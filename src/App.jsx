import React, { useEffect } from "react";
import CreateAccount from "./features/auth/CreateAccount";
import Login from "./features/auth/Login";
import AppLayout from "./pages/AppLayout";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "./components/Loader";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const { isDarkMode } = useSelector((store) => store.boards);
  useEffect(() => {
    document.body.style.backgroundColor = isDarkMode ? "#000112" : "#F4F7FD";
  }, [isDarkMode]);

  return (
    <div className="relative h-screen w-full">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" index element={<Login />} />
          <Route path="/signup" element={<CreateAccount />} />
          <Route element={<ProtectedRoute />}>
            <Route
              path="/app"
              element={
                <React.Suspense fallback={<Loader />}>
                  <AppLayout />
                </React.Suspense>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Zoom}
      />
    </div>
  );
}

export default App;
