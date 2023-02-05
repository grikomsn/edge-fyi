import type { EdgeConfigClient } from "@vercel/edge-config";
import { createClient } from "@vercel/edge-config";
import type { VercelApiHandler } from "@vercel/node";

import { edgeNotFound, edgeRedirect, notFound } from "./utils";

export interface FyiOptions {
  host?: string;
  query: string;
  edgeClient?: EdgeConfigClient;
  onNotFound?: VercelApiHandler;
}

export type Fyi = (opts: FyiOptions) => VercelApiHandler;

export const fyi: Fyi = ({ host, query, edgeClient, onNotFound = notFound }) => {
  const baseUrl = host ? `https://${host}` : undefined;
  const client = edgeClient || createClient(process.env.EDGE_CONFIG);
  return async (req, res) => {
    const slug = req.query[query];
    if (typeof slug !== "string") {
      baseUrl ? res.redirect(baseUrl) : void onNotFound(req, res);
      return;
    }
    const dest = await client.get<string>(slug);
    if (dest) res.redirect(dest);
    baseUrl ? res.redirect(`${baseUrl}/${slug}`) : void onNotFound(req, res);
  };
};

export interface EdgeFyiOptions {
  host?: string;
  query: string;
  edgeClient?: EdgeConfigClient;
  onNotFound?: (req: Request) => Response;
}

export type EdgeFyi = (opts: EdgeFyiOptions) => (req: Request) => Promise<Response>;

export const edgeFyi: EdgeFyi = ({ host, query, edgeClient, onNotFound = edgeNotFound }) => {
  const baseUrl = host ? `https://${host}` : undefined;
  const client = edgeClient || createClient(process.env.EDGE_CONFIG);
  return async (req: Request) => {
    const url = new URL(req.url);
    const slug = url.searchParams.get(query);
    if (typeof slug !== "string") {
      return baseUrl ? edgeRedirect(baseUrl) : onNotFound(req);
    }
    const dest = await client.get<string>(slug);
    if (dest) return edgeRedirect(dest);
    return baseUrl ? edgeRedirect(`${baseUrl}/${slug}`) : onNotFound(req);
  };
};
