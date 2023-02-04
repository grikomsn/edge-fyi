# edge-fyi

Self-host your own short link service using Vercel Edge Config

[![npm/v](https://badgen.net/npm/v/edge-fyi)](https://www.npmjs.com/package/edge-fyi)
[![npm/dt](https://badgen.net/npm/dt/edge-fyi)](https://www.npmjs.com/package/edge-fyi)
[![stars](https://badgen.net/github/stars/grikomsn/edge-fyi)](https://github.com/grikomsn/edge-fyi)

## Installing

```sh
# using npm
npm install edge-fyi

# using yarn
yarn add edge-fyi

# using pnpm
pnpm install edge-fyi
```

## Usage

Create **`api/[slug].ts` or `api/handler.ts`** (or any other name) and export default the `fyi` function with your configuration.

```ts
import { fyi } from "edge-fyi";

export default fyi({
  query: "slug", // (required) the query parameter to use as the slug
  host: "nibras.co", // (optional) redirect not found short links to https://nibras.co/:slug
  edgeClient: customClient, // (optional) custom vercel edge client
  onNotFound: (req) => {}, // (optional) callback when short link is not found
});
```

Then create **`vercel.json`** to configure redirects and rewrites.

- Make sure your rewrite query parameter is the same as defined above.
- If your API route filename is `api/[slug].ts`, rewrite `/:slug` to `/api/[slug]`. If you're using something like `api/handler.ts`, rewrite `/:slug` to `/api/handler`.
- (Optional) If you configured a `host`, add a redirect to handle `/` to redirect to your host.

```jsonc
{
  "rewrites": [
    {
      "source": "/:slug",
      "destination": "/api/handler"
    }
  ],
  "redirects": [
    {
      "source": "/",
      "destination": "/api/handler",
      "permanent": false
    }
  ]
}
```

## Examples

- https://github.com/grikomsn/nbrs.fyi
- https://nbrs.fyi

## License

[MIT License, Copyright (c) 2023 Griko Nibras](./LICENSE)
