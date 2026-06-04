import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  nitro: {
    preset: process.env.NITRO_PRESET ?? "node-server",
  },
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
