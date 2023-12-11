import { createContext, useContext, useMemo } from "react";
import { Navigate } from "react-router-dom";
import { googleAuth, checkAuth } from "../services/firebase";
// import { useLocalStorage } from "./useLocalStorage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const user = sessionStorage.getItem("chuckn");

  // call this function when you want to authenticate the user
  const login = async () => {
    try {
      const userData = await googleAuth();
      sessionStorage.setItem("chuckn", userData._tokenResponse.refreshToken)
      return userData;
    } catch (error) {}
  };

  // call this function to sign out logged in user
  const logout = () => {
    // setUser(null);
    <Navigate to="/login" replace={true} />;
  };

  const isAuthed = async (callback) => {
    const userData = await checkAuth(callback);
    return userData || null;
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      isAuthed,
    }),
    [user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
