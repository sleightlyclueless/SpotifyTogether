import * as React from "react";
import axios from "axios";
import { Configuration, DefaultApi } from "../adapter/api/__generated/index.ts";
import { useAuth } from "../provider/AuthProvider.tsx";

export function useApiClient() {
  const { token } = useAuth();

  return React.useMemo(() => {
    const basePath = "/api";

    const authHeaders: Record<string, string> = token
      ? {
          Authorization: `${token}`,
        }
      : {};

    const axiosInstance = axios.create({
      headers: authHeaders,
    });

    const config = new Configuration({ basePath });
    return new DefaultApi(config, basePath, axiosInstance);
  }, [token]);
}
