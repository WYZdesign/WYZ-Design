import { Novu } from "@novu/node";

let _novu: Novu | null = null;

export function getNovu(): Novu | null {
  if (_novu) return _novu;
  const key = process.env.NOVU_API_KEY;
  if (!key) return null;
  _novu = new Novu(key);
  return _novu;
}

export async function triggerNotification(templateId: string, email: string, payload: Record<string, string>) {
  const novu = getNovu();
  if (!novu) return;
  try {
    await novu.trigger(templateId, {
      to: { subscriberId: email.replace(/[^a-zA-Z0-9]/g, "_"), email },
      payload,
    });
  } catch (e) { console.error("[novu:trigger]", e); }
}

export async function sendAdminAlert(title: string, body: string) {
  const adminEmail = process.env.ADMIN_EMAIL || "torree.marcel@gmail.com";
  await triggerNotification("admin-alert", adminEmail, { title, body });
}
