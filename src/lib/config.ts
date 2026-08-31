import Constants from "expo-constants";

const API_PORT = 3000;

function resolveBaseUrl(): string {
  const override = process.env.EXPO_PUBLIC_API_URL;
  if (override) return override.replace(/\/+$/, "");
  const host = Constants.expoConfig?.hostUri?.split(":")[0];
  if (host) return `http://${host}:${API_PORT}`;
  return `http://localhost:${API_PORT}`;
}

export const API_URL = resolveBaseUrl();
