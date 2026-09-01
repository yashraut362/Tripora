import { authClient } from "@/lib/auth";
import { API_URL } from "@/lib/config";

export interface TripSelections {
  destination: string;
  days: number;
  budget: number | null;
  activities: string[];
}

export interface Trip extends TripSelections {
  id: string;
  imageUrl?: string | null;
}

export interface ItineraryStop {
  slot: "Morning" | "Afternoon" | "Evening";
  title: string;
  detail: string;
  mapsQuery: string;
  lat?: number;
  lng?: number;
  tips?: string;
  photoUrl?: string;
}

export interface ItineraryDay {
  day: number;
  theme: string;
  stops: ItineraryStop[];
}

export interface TripDetail extends Trip {
  intro: string;
  itinerary: ItineraryDay[];
}

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

  const cookie = await authClient.getCookie();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...init,
      signal: controller.signal,
      credentials: "omit",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie,
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (!res.ok) {
      throw new ApiError(
        res.status,
        `${init.method ?? "GET"} ${path} failed (${res.status})`,
      );
    }
    if (res.status === 204) {
      return undefined as T;
    }
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}
