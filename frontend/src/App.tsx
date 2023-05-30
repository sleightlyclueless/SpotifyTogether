import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./AppRoutes.tsx";
import { AuthProvider } from "./provider/AuthProvider.tsx";

export const App = () => {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ChakraProvider>
  );
};
