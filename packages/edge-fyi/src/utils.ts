import type { VercelApiHandler } from "@vercel/node";

export const notFound: VercelApiHandler = (_req, res) => {
  res.status(404).end();
};

export const edgeNotFound = (_req: Request): Response => {
  return new Response(null, { status: 404 });
};

export const edgeRedirect = (url: string): Response => {
  return new Response(null, { status: 307, headers: { Location: url } });
};
