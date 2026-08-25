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

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type RequestOptions = Omit<RequestInit, "body" | "headers"> & {
  body?: unknown;
  headers?: Record<string, string>;
  timeoutMs?: number;
};

export async function api<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, headers, timeoutMs = 10000, ...init } = options;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...init,
      signal: controller.signal,
      headers: { "Content-Type": "application/json", ...headers },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (!res.ok) {
      throw new ApiError(
        res.status,
        `${init.method ?? "GET"} ${path} failed (${res.status})`,
      );
    }
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}
