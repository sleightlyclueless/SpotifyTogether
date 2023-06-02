import React, { createContext } from "react";
import invariant from "tiny-invariant";
import { useToast, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage.tsx";

// Define custom User type
export type User = {
  email: string;
  firstName: string;
  id: string;
  lastName: string;
  iat: number;
  exp: number;
  iss: string;
};

// Schema for login
export type LoginSchema = {
  email: string;
  password: string;
};
// Schema for register
export type RegisterSchema = {
  email: string;
  fName: string;
  lName: string;
  password: string;
};

// Object type for context including neccessary types and functions to know if a valid user is logged in or not.
type AuthContext = {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  actions: {
    login: (loginData: LoginSchema) => void;
    logout: () => void;
    register: (userData: RegisterSchema) => void;
  };
};
const authContext = createContext<AuthContext | null>(null);

// Check if the user is logged in and has a valid JWT through local storage.
export type AuthProviderProps = {
  children: React.ReactNode;
};
export const AuthProvider = ({ children }: AuthProviderProps) => {
  // Global data
  const [token, setToken] = useLocalStorage<User | null>("accessToken", null);
  const [user, setUser] = useLocalStorage<User | null>("user", null);
  const toast = useToast(); // Use toast messages to display errors
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

  // Login function
  const login = async (values: LoginSchema) => {
    // POST: With email and password call the api at localhost:3000/auth/login and receive a JWT
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      // Send the content of the form as JSON (Form and Fieldnames defined at src\pages\LoginPage.tsx)
      body: JSON.stringify({ email: values.email, password: values.password }),
    });
    const data = await res.json();

    // Check the result of the request - if the request was successful, set the JWT and user data.
    if (res.ok) {
      setToken(data.accessToken);
      setUser(JSON.parse(atob(data.accessToken.split(".")[1])));
      navigate("/", { replace: true });
    } else {
      errorToast(data.errors);
    }
  };

  // Logout function
  const logout = () => {
    setToken(null);
    setUser(null);
  };

  // Register function
  const register = async (values: RegisterSchema) => {
    // POST: With email, password, first name and last name call the api at localhost:3000/auth/register
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

  // Return user object out of context
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
