const isProd = process.env.NODE_ENV === "production";

export const logger = {
  error: (tag: string, msg: unknown) => { if (!isProd) console.error(`[${tag}]`, msg); },
  warn: (tag: string, msg: unknown) => { if (!isProd) console.warn(`[${tag}]`, msg); },
  info: (tag: string, msg: unknown) => { if (!isProd) console.log(`[${tag}]`, msg); },
};
