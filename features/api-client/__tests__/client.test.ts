import { describe, it, expect, vi, beforeEach } from "vitest";
import { api, ApiError } from "../lib/client";

const mockFetch = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  global.fetch = mockFetch;
  // @ts-expect-error -- mock window.location for URL construction
  global.window = { location: { origin: "http://localhost:3000" } };
});

function mockResponse(data: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? "OK" : "Error",
    json: () => Promise.resolve(data),
  };
}

describe("api client", () => {
  it("GET request sends correct method", async () => {
    mockFetch.mockResolvedValue(mockResponse({ ok: true }));
    const result = await api.get("/api/test");
    expect(result).toEqual({ ok: true });
    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:3000/api/test",
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("POST sends JSON body", async () => {
    mockFetch.mockResolvedValue(mockResponse({ id: 1 }));
    await api.post("/api/items", { body: { name: "test" } });
    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:3000/api/items",
      expect.objectContaining({
        method: "POST",
        body: '{"name":"test"}',
      }),
    );
  });

  it("PUT sends correct method", async () => {
    mockFetch.mockResolvedValue(mockResponse({ updated: true }));
    await api.put("/api/items/1", { body: { name: "updated" } });
    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ method: "PUT" }),
    );
  });

  it("PATCH sends correct method", async () => {
    mockFetch.mockResolvedValue(mockResponse({}));
    await api.patch("/api/items/1", { body: { status: "done" } });
    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ method: "PATCH" }),
    );
  });

  it("DELETE sends correct method", async () => {
    mockFetch.mockResolvedValue(mockResponse({}));
    await api.delete("/api/items/1");
    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ method: "DELETE" }),
    );
  });

  it("appends query params to URL", async () => {
    mockFetch.mockResolvedValue(mockResponse([]));
    await api.get("/api/search", { params: { q: "hello", page: "2" } });
    const url = mockFetch.mock.calls[0][0];
    expect(url).toContain("q=hello");
    expect(url).toContain("page=2");
  });

  it("sets Content-Type header", async () => {
    mockFetch.mockResolvedValue(mockResponse({}));
    await api.get("/api/test");
    const headers = mockFetch.mock.calls[0][1].headers;
    expect(headers["Content-Type"]).toBe("application/json");
  });

  it("throws ApiError on non-ok response", async () => {
    mockFetch.mockResolvedValue(
      mockResponse({ error: "Not found" }, 404),
    );
    await expect(api.get("/api/missing")).rejects.toThrow(ApiError);
    await mockFetch.mockResolvedValue(
      mockResponse({ error: "Not found" }, 404),
    );
    try {
      await api.get("/api/missing");
    } catch (e) {
      expect(e).toBeInstanceOf(ApiError);
      expect((e as ApiError).status).toBe(404);
      expect((e as ApiError).message).toBe("Not found");
    }
  });

  it("handles non-JSON error response gracefully", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      json: () => Promise.reject(new Error("not json")),
    });
    try {
      await api.get("/api/broken");
    } catch (e) {
      expect(e).toBeInstanceOf(ApiError);
      expect((e as ApiError).message).toBe("Internal Server Error");
    }
  });

  it("does not include body for GET requests", async () => {
    mockFetch.mockResolvedValue(mockResponse({}));
    await api.get("/api/test");
    const init = mockFetch.mock.calls[0][1];
    expect(init.body).toBeUndefined();
  });
});
