import React, { createContext } from "react";
import invariant from "tiny-invariant";
import { useToast, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage.ts";

export type User = {
  email: string;
  firstName: string;
  id: string;
  lastName: string;
  iat: number;
  exp: number;
  iss: string;
};

export type LoginData = {
  email: string;
  password: string;
};
export type RegisterData = {
  email: string;
  vorname: string;
  nachname: string;
  password: string;
};
type AuthContext = {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  actions: {
    login: (loginData: LoginData) => void;
    logout: () => void;
    register: (userData: RegisterData) => void;
  };
};

const authContext = createContext<AuthContext | null>(null);

export type AuthProviderProps = {
  children: React.ReactNode;
};
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useLocalStorage<User | null>("accessToken", null);
  const [user, setUser] = useLocalStorage<User | null>("user", null);
  const toast = useToast();
  const navigate = useNavigate();
  const errorToast = (errors: string[]) => {
    toast({
      title: "Error occured.",
      description: (
        <>
          {errors?.map((e) => (
            <Text>{e}</Text>
          ))}{" "}
        </>
      ),
      status: "error",
      duration: 9000,
      isClosable: true,
    });
  };

  const login = async (values: LoginData) => {
    console.log("login called", values);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ email: values.email, password: values.password }),
    });

    const data = await res.json();
    if (res.ok) {
      setToken(data.accessToken);
      setUser(JSON.parse(atob(data.accessToken.split(".")[1])));
      navigate("/", { replace: true });
    } else {
      errorToast(data.errors);
    }
  };
  const logout = () => {
    setToken(null);
    setUser(null);
  };
  const register = async (values: RegisterData) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(values),
      headers: { "content-type": "application/json" },
    });
    const resBody = await res.json();
    if (res.status === 201) {
      toast({
        title: "Account created.",
        description: "We've created your account for you.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      navigate("/auth/login", { replace: true });
    } else if (resBody.errors) {
      errorToast(resBody.errors);
    }
  };
  console.log(user);
  return (
    <authContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        token,
        actions: {
          login,
          logout,
          register,
        },
      }}
    >
      {children}
    </authContext.Provider>
  );
};

export function useAuth() {
  const contextValue = React.useContext(authContext);
  if (!contextValue) {
    invariant(false, "ensure that you use useAuth within its provider");
  }
  return contextValue;
}
