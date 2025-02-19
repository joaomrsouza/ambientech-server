import type { Job } from "agenda";
import { prisma } from "../database";
import Mail from "../services/mail";
import emailModel from "../utils/emailModel";
import { type Sensor } from "../utils/enums";

export const name = "notify";

type NotifyAttr = {
  sensor: Sensor;
  data: number[];
};

export async function processor(job: Job<NotifyAttr>) {
  const { data, sensor } = job.attrs.data;

  const notifications = await prisma.notification.findMany({
    where: { sensor: sensor },
  });

  const notificationsByEmail = notifications.reduce(
    (map, { email, scenario, value, id }) =>
      map.set(email, [...(map.get(email) ?? []), { scenario, value, id }]),
    new Map<string, { scenario: string; value?: number | null; id: string }[]>()
  );

  notificationsByEmail.forEach(async (conditions, email) => {
    const messages: string[] = [];
    const idsToDelete: string[] = [];

    conditions.forEach(({ scenario, value, id }) => {
      const message = operatorHandlers[scenario]?.(data, value);
      if (!message) return;

      messages.push(message);
      idsToDelete.push(id);
    });

    if (messages.length === 0) return;

    await new Mail({
      html: emailModel(messages, email),
      to: email,
    }).send();

    await prisma.notification.deleteMany({
      where: { id: { in: idsToDelete } },
    });
  });
}

const operatorHandlers: Record<
  string,
  (data: number[], value?: number | null) => string | false
> = {
  "É maior que": (data, value) =>
    data.every((d) => d > value!) && `A temperatura ultrapassou ${value}°C.`,
  "É menor que": (data, value) =>
    data.every((d) => d < value!) && `A temperatura está abaixo de ${value}°C.`,
  "Umidade crítica": (data) =>
    data.every((d) => d < 10) &&
    "🌿 Ei, cuidado! A umidade está em um nível crítico. Fique atento ao ambiente e tome medidas para seu bem-estar! 😊💧",
  "Umidade Baixa": (data) =>
    data.every((d) => d < 30) &&
    "⚠️ Atenção! A umidade está baixa. Lembre-se de cuidar do ambiente e da sua saúde! 🌿 ",
  "Umidade Alta": (data) =>
    data.every((d) => d > 60) &&
    "🌫️ A umidade está alta! Fique atento ao ambiente e tome precauções para manter o conforto e a saúde. 😊",
  "Sem chuva": (data) =>
    data.every((d) => d <= 0) && "😎 Atenção! Sem chuva no momento! ☀️",
  Sereno: (data) =>
    data.every((d) => d <= 45) && "☔ Atenção! Sereno no momento! 🌦️",
  "Chuva Moderada": (data) =>
    data.every((d) => d > 45) &&
    "🌧️ Cuidado! A chuva está moderada. Fique atento e proteja-se para não se molhar muito! 🌂",
  "Chuva Forte": (data) =>
    data.every((d) => d > 75) &&
    "☔ Alerta! A chuva está forte. Se possível, procure abrigo até passar, e evite sair desprotegido(a)! ⛈️",
  Boa: (data) =>
    data.every((d) => d > 50) &&
    "🍃 A quailidade do ar está boa, aproveite o ar livre! 😄",
  Ruim: (data) =>
    data.every((d) => d < 50) &&
    "⚠️ Atenção o ar está ruim! Se puder, evite esforço excessivo ao ar livre e cuide da respiração! 😷 ",
  "Muito Ruim": (data) =>
    data.every((d) => d < 30) &&
    "🚨 Cuidado! A qualidade do ar está muito ruim, o ar está muito poluído. Evite exposição prolongada e, se possível, use máscara ou fique em locais fechados! 🏠😷",
  Moderada: (data) =>
    data.every((d) => d <= 40) &&
    "🌫️ Atenção! A fumaça está moderada. Fique atento(a), evite áreas com muita exposição e cuide da sua respiração! 😊",
  Forte: (data) =>
    data.every((d) => d > 40) &&
    "🌫️ Cuidado! A fumaça está forte. Tente evitar a área e proteja-se para garantir sua segurança e bem-estar! 😷",
  Critica: (data) =>
    data.every((d) => d > 70) &&
    "🚨 Alerta! A fumaça está em níveis críticos. Procure abrigo em local seguro e siga as recomendações de segurança imediatamente! 🏃‍♀️🌬️",
};
