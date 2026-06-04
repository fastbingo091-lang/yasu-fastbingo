import { createFileRoute } from "@tanstack/react-router";
import { createHash } from "crypto";

const APP_URL = "https://yasu-fastbingo.onrender.com";

function deriveSecret(token: string): string {
  return createHash("sha256").update(`tg-webhook:${token}`).digest("base64url");
}

async function tg(token: string, method: string, body: unknown) {
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return { status: res.status, body: await res.json().catch(() => ({})) };
}

export const Route = createFileRoute("/api/public/telegram/setup")({
  server: {
    handlers: {
      GET: async () => {
        const token = process.env.TELEGRAM_BOT_TOKEN;
        if (!token) return Response.json({ ok: false, error: "missing TELEGRAM_BOT_TOKEN" }, { status: 500 });

        // Always register the webhook on the Render deployment so Telegram
        // delivers updates to the live app the mini app runs on.
        const webhookUrl = `${APP_URL}/api/public/telegram/webhook`;
        const secret = deriveSecret(token);

        const setWebhook = await tg(token, "setWebhook", {
          url: webhookUrl,
          secret_token: secret,
          allowed_updates: ["message", "edited_message"],
          drop_pending_updates: true,
        });
        const setMenu = await tg(token, "setChatMenuButton", {
          menu_button: {
            type: "web_app",
            text: "🎮 Play Bingo",
            web_app: { url: APP_URL },
          },
        });
        const info = await tg(token, "getWebhookInfo", {});

        return Response.json({ ok: true, webhookUrl, setWebhook, setMenu, info });
      },
    },
  },
});
