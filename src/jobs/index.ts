import * as notify from "./notify";
import Agenda from "agenda";

class Jobs {
  private agenda: Agenda | undefined;

  public notify = notify;

  getAgenda() {
    if (!this.agenda) {
      this.agenda = new Agenda({
        db: { address: process.env.MONGODB_URI! },
        processEvery: "minute",
      });
    }

    return this.agenda;
  }

  async startJobs() {
    const agenda = this.getAgenda();
    await agenda.start();

    agenda.define(this.notify.name, this.notify.processor);
  }

  async stopJobs() {
    await this.agenda?.stop();
    await this.agenda?.close();
  }
}

export const jobService = new Jobs();
