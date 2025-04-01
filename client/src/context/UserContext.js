import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [id, setId] = useState(null);
  const [userName, setUserName] = useState("");
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/user/get-user`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!response.ok) throw new Error("Failed to fetch user data");
        const data = await response.json();
        setId(data.user._id);
        setPrompts(data.user.prompts);
        setUserName(data.user.name);
      } catch (error) {
        console.error("Error in getUser:", error);
      }
    };
    getUser();
  }, []);

  return (
    <UserContext.Provider
      value={{ id, setId, userName, prompts, loading, setLoading }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
