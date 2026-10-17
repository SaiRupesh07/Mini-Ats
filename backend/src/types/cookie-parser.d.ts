import type { RequestHandler } from "express";

declare module "cookie-parser" {
  interface CookieParseOptions {
    decode?(value: string): string;
  }

  function cookieParser(
    secret?: string | string[],
    options?: CookieParseOptions
  ): RequestHandler;

  export = cookieParser;
}

declare module "express" {
  interface Request {
    secret?: string;
    cookies: Record<string, unknown>;
    signedCookies: Record<string, unknown>;
  }
}
