import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";
import { createAuthClient } from "better-auth/react";
import { API_URL } from "@/lib/config";

export const authClient = createAuthClient({
  baseURL: API_URL,
  plugins: [
    expoClient({
      scheme: "tripora",
      storagePrefix: "tripora",
      storage: SecureStore,
    }),
  ],
});
