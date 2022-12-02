import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const login = async (inputs) => {
    const res = await axios.post(
      "http://localhost:8800/api/auth/login",
      inputs,
      {
        withCredentials: true, //Required while using cookie => config at index.js
      }
    );
    setCurrentUser(res.data);
  };

  const imgTransform = (img) => {
    let src = img;
    let check = img.substr(0, 8);
    if (check !== "https://") src = "./upload/" + img;
    return src;
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, imgTransform }}>
      {children}
    </AuthContext.Provider>
  );
};
