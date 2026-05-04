import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "../middleware";

function createRequest(path: string, cookies?: Record<string, string>) {
  const url = `http://localhost:3000${path}`;
  const req = new NextRequest(url);
  if (cookies) {
    for (const [name, value] of Object.entries(cookies)) {
      req.cookies.set(name, value);
    }
  }
  return req;
}

describe("middleware", () => {
  describe("public routes", () => {
    const publicPaths = [
      "/",
      "/sign-in",
      "/sign-up",
      "/forgot-password",
      "/reset-password",
      "/pricing",
      "/api/trpc",
      "/api/auth",
      "/terms",
      "/privacy",
      "/about",
      "/contact",
      "/guide",
      "/showcase",
      "/careers",
    ];

    for (const path of publicPaths) {
      it(`allows ${path} without auth`, async () => {
        const res = await middleware(createRequest(path));
        expect(res.status).toBe(200);
        expect(res.headers.get("location")).toBeNull();
      });
    }

    it("allows nested public route /api/auth/callback/google", async () => {
      const res = await middleware(createRequest("/api/auth/callback/google"));
      expect(res.status).toBe(200);
    });

    it("allows nested public route /api/trpc/projects.getMany", async () => {
      const res = await middleware(createRequest("/api/trpc/projects.getMany"));
      expect(res.status).toBe(200);
    });
  });

  describe("protected routes", () => {
    it("redirects to /sign-in when no session cookie", async () => {
      const res = await middleware(createRequest("/projects"));
      expect(res.status).toBe(307);
      expect(new URL(res.headers.get("location")!).pathname).toBe("/sign-in");
    });

    it("allows access with better-auth.session_token cookie", async () => {
      const res = await middleware(
        createRequest("/projects", { "better-auth.session_token": "abc123" })
      );
      expect(res.status).toBe(200);
    });

    it("allows access with __Secure-better-auth.session_token cookie", async () => {
      const res = await middleware(
        createRequest("/projects", {
          "__Secure-better-auth.session_token": "abc123",
        })
      );
      expect(res.status).toBe(200);
    });

    it("redirects when cookie key exists but value is empty", async () => {
      const res = await middleware(
        createRequest("/projects", { "better-auth.session_token": "" })
      );
      expect(res.status).toBe(307);
    });
  });

  describe("edge cases", () => {
    it("does not treat /sign-inner as a public route", async () => {
      const res = await middleware(createRequest("/sign-inner"));
      expect(res.status).toBe(307);
    });

    it("does not treat /about-us as a public route", async () => {
      const res = await middleware(createRequest("/about-us"));
      expect(res.status).toBe(307);
    });
  });
});
