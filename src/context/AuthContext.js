import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      axios.get("http://localhost:5000/api/auth/me", { headers: { "authToken": `${token}` } })
        .then(res => {
          setUser(res.data.user);
          setIsAuthenticated(true);
        })
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      if (res.status === 200) {
        //console.log(res.data);
        localStorage.setItem("authToken", res.data.authToken);
        setUser(res.data.user);
        setIsAuthenticated(true);
        console.log("Login successful:", res.data.message);
        return { success: true };
      }
    } catch (error) {
      return { success: false, message: error.response?.data.message || error.message };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("authToken");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};


export default AuthProvider;