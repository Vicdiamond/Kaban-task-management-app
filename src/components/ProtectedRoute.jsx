import { Navigate, Outlet } from "react-router-dom";
import Loader from "./Loader";
// import { useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { useState, useEffect } from "react";

function ProtectedRoute() {
  const [authState, setAuthState] = useState({ user: null, checked: false });
  // const { isLoading } = useSelector((store) => store.boards);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthState({ user, checked: true });
    });

    return () => unsubscribe();
  }, []);

  if (!authState.checked) {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Loader />;
      </div>
    );
  }

  if (!authState.user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
