import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";


import ApiUrl from "../constants/ApiUrl"

const AuthContext =
  createContext(null);

export const AuthProvider = ({
  children,
}) => {
  const [user, setUser] =
    useState(null);

  const [token, setToken] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [hydrated, setHydrated] =
    useState(false);

  // LOAD SESSION
  const loadSession = async () => {
    try {
      const storedToken =
        localStorage.getItem(
          "token"
        );

      if (storedToken) {
        setToken(storedToken);

        await fetchMe(
          storedToken
        );
      } else {
        setUser(null);
        setToken(null);
      }
    } catch (e) {
      console.log(
        "SESSION LOAD ERROR:",
        e
      );
    } finally {
      setHydrated(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSession();
  }, []);

  // FETCH USER
  const fetchMe = async (
    authToken
  ) => {
    try {
      const tokenToUse =
        authToken ||
        localStorage.getItem(
          "token"
        );

      if (!tokenToUse) return;

      const res = await fetch(
        ApiUrl.ME,
        {
          headers: {
            Authorization: `Bearer ${tokenToUse}`,
          },
        }
      );

      const data =
        await res.json();

      console.log(
        "ME RESPONSE:",
        data
      );

      setUser(data.user);
    } catch (e) {
      console.log(
        "FETCH ME ERROR:",
        e
      );
    }
  };

  // LOGIN
  const login = async (
    email,
    pin
  ) => {
    try {
      const res = await fetch(
        ApiUrl.LOGIN_USER,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email,
            pin,
          }),
        }
      );

      const data =
        await res.json();

      console.log(
        "LOGIN RESPONSE:",
        data
      );

      // LOGIN FAILED
      if (!res.ok) {
        return {
          success: false,

          verified:
            data.verified,

          message:
            data.message,
        };
      }

      // EMAIL NOT VERIFIED
      // EXACT APP LOGIC
      if (
        data.verified ===
        false
      ) {
        return {
          success: false,

          verified: false,

          message:
            data.message,

          user: data.user,
        };
      }

      // NO TOKEN
      if (!data.token) {
        return {
          success: false,

          message:
            "No token returned",
        };
      }

      // SAVE TOKEN
      localStorage.setItem(
        "token",
        data.token
      );

      setToken(data.token);

      await fetchMe(
        data.token
      );

      return {
        success: true,
      };

    } catch (e) {
      console.log(
        "LOGIN ERROR:",
        e
      );

      return {
        success: false,
        message:
          "Network error",
      };
    }
  };

  // LOGOUT
  const logout = async () => {
    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    setUser(null);

    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        hydrated,
        login,
        logout,
        fetchMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx =
    useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      "useAuth must be inside AuthProvider"
    );
  }

  return ctx;
};