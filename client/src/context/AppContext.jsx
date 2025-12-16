import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY || "€";

  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [cars, setCars] = useState([]);

  // =======================
  // FETCH USER DATA
  // =======================
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/data");
      if (data.success) {
        setUser(data.user);
        setIsOwner(data.user.role === "owner");
      } else {
        navigate("/");
      }
    } catch (error) {
      toast.error("Failed to fetch user data");
    }
  };

  // =======================
  // FETCH ALL CARS
  // =======================
  const fetchCars = async () => {
    try {
      const { data } = await axios.get("/api/user/cars");
      data.success ? setCars(data.cars) : toast.error("Failed to fetch cars");
    } catch (error) {
      toast.error("Failed to fetch cars");
    }
  };

  // =======================
  // LOGOUT
  // =======================
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsOwner(false);
    axios.defaults.headers.common["Authorization"] = "";
    toast.success("Logged out successfully");
  };

  // =======================
  // LOAD TOKEN ON INIT
  // =======================
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    fetchCars();
  }, []);

  // =======================
  // FETCH USER AFTER TOKEN
  // =======================
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `${token}`;
      fetchUser();
    }
  }, [token]);

  // =======================
  // CONTEXT VALUE
  // =======================
  const value = {
    navigate,
    currency,
    token,
    setToken,
    user,
    setUser,
    isOwner,
    setIsOwner,
    showLogin,
    setShowLogin,
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
    cars,
    setCars,
    fetchUser,
    fetchCars,
    logout,
    axios,
  };

  return (
    <AppContext.Provider value={value}>{children}</AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
