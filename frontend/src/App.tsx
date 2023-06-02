// Chakra UI components and styling in your application.
import { ChakraProvider } from "@chakra-ui/react";
// React Query for data fetching and caching.
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// React Router components and hooks in your application. -> See 1-AppRoutes.tsx
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./AppRoutes.tsx";
// Handle authentication in your application with User Table and JWT. -> See provider/AuthProvider.tsx
import { AuthProvider } from "./provider/AuthProvider.tsx";

export const App = () => {
  return (
    <ChakraProvider>
      <QueryClientProvider client={new QueryClient()}>
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ChakraProvider>
  );
};
