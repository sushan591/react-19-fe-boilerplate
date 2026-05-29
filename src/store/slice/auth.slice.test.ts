import { describe, it, expect } from "vitest";
import type { User } from "@/types";
import authReducer, { setToken, setAuthTokens, clearToken } from "./auth.slice";

const initialState = {
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  user: null,
};

const mockUser: User = {
  id: "1",
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
  email: "a@b.c",
  first_name: "A",
  last_name: "B",
};

describe("authSlice", () => {
  it("returns initial state for an unknown action", () => {
    expect(authReducer(undefined, { type: "@@INIT" })).toEqual(initialState);
  });

  it("setToken updates only the access token", () => {
    const next = authReducer(initialState, setToken("abc"));
    expect(next).toEqual({ ...initialState, token: "abc" });
    expect(next.isAuthenticated).toBe(false);
  });

  it("setAuthTokens stores both tokens, marks authenticated, and stores the user", () => {
    const next = authReducer(
      initialState,
      setAuthTokens({ token: "a", refreshToken: "r", user: mockUser }),
    );
    expect(next).toEqual({
      token: "a",
      refreshToken: "r",
      isAuthenticated: true,
      user: mockUser,
    });
  });

  it("clearToken resets every field", () => {
    const populated = {
      token: "a",
      refreshToken: "r",
      isAuthenticated: true,
      user: mockUser,
    };
    expect(authReducer(populated, clearToken())).toEqual(initialState);
  });
});
