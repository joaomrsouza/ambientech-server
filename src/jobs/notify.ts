import type { Job } from "agenda";
import { prisma } from "../database";
import Mail from "../services/mail";
import emailModel from "../utils/emailModel";

export const name = "notify";

type NotifyAttr = {
  teste: string;
};

export async function processor(job: Job<NotifyAttr>) {
  const notifications = await prisma.notification.findMany();

  const notificationsByEmail = notifications.reduce(
    (map, { email, condition }) =>
      map.set(email, [...(map.get(email) ?? []), condition]),
    new Map<string, string[]>()
  );

  notificationsByEmail.forEach(async (conditions, email) => {
    const messages: string[] = [];

    // TODO: Verificar condições e push mensagens no array

    await new Mail({
      html: emailModel(messages),
      to: email,
    }).send();
  });
}
