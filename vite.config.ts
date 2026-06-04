import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const nitroPreset = process.env.NITRO_PRESET;

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  // Only override the Nitro preset when explicitly requested (e.g. Render sets
  // NITRO_PRESET=node-server). On Lovable's Cloudflare-worker deployment the
  // preset must stay the platform default so the build exports a fetch()
  // handler — forcing node-server breaks SSR with
  // "Handler does not export a fetch() function."
  ...(nitroPreset ? { nitro: { preset: nitroPreset } } : {}),
  vite: {
    preview: {
      allowedHosts: true,
      host: true,
      port: Number(process.env.PORT) || 4173,
    },
    server: {
      allowedHosts: true,
      host: true,
    },
  },
});
