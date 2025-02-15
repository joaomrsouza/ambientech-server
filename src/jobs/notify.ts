import type { Job } from "agenda";
import { prisma } from "../database";
import Mail from "../services/mail";
import emailModel from "../utils/emailModel";
import { sensorTextMap, type Operator, type Sensor } from "../utils/enums";

export const name = "notify";

type NotifyAttr = {
  sensor: Sensor;
  data: number[];
};

export async function processor(job: Job<NotifyAttr>) {
  const { data, sensor } = job.attrs.data;

  const notifications = await prisma.notification.findMany({
    where: { condition: { startsWith: sensor } },
  });

  const notificationsByEmail = notifications.reduce(
    (map, { email, condition }) =>
      map.set(email, [...(map.get(email) ?? []), condition]),
    new Map<string, string[]>()
  );

  notificationsByEmail.forEach(async (conditions, email) => {
    const messages: string[] = [];

    conditions.forEach((condition) => {
      const [_, operator, valueString] = condition.split(" ") as [
        Sensor,
        Operator,
        string
      ];
      const value = Number(valueString);

      const message = operatorHandlers[operator](sensor, data, value);

      message && messages.push(message);
    });

    await new Mail({
      html: emailModel(messages),
      to: email,
    }).send();

    // TODO: Deletar notificação?
  });
}

const operatorHandlers: Record<
  Operator,
  (sensor: Sensor, data: number[], value: number) => string | false
> = {
  // TODO: Traduzir o value para as labels
  "!=": (sensor, data, value) =>
    data.every((d) => d !== value) &&
    `${sensorTextMap[sensor]} agora é diferente de ${value}.`,
  "=": (sensor, data, value) =>
    data.some((d) => d === value) &&
    `${sensorTextMap[sensor]} agora é igual a ${value}`,
  "<": (sensor, data, value) =>
    data.some((d) => d < value) &&
    `${sensorTextMap[sensor]} agora é menor que ${value}`,
  ">": (sensor, data, value) =>
    data.some((d) => d > value) &&
    `${sensorTextMap[sensor]} agora é maior que ${value}`,
  "<=": (sensor, data, value) =>
    data.some((d) => d <= value) &&
    `${sensorTextMap[sensor]} agora é menor ou igual a ${value}`,
  ">=": (sensor, data, value) =>
    data.some((d) => d >= value) &&
    `${sensorTextMap[sensor]} agora é maior ou igual a ${value}`,
};
