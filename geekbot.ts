// https://geekbot.com/developers
import { SECOND } from "https://deno.land/std@0.83.0/datetime/mod.ts";

export type Question = { id: number; text: string };
export type User = { id: string; username: string };
export type Standup = {
  id: number;
  channel: string;
  questions: Question[];
  users: User[];
};
export type Answer = {
  answer: string;
  question: string;
  id: number;
  images: any[] | undefined;
};
export type Report = { timestamp: number; questions: Answer[]; id: number };

export type GetReportOptions = {
  question: Question;
  user: User;
  standup: Standup;
  after?: Date;
  before?: Date;
};

export class Client {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  private async request(url: string, params?: RequestInit): Promise<Response> {
    const resp = await fetch(url, {
      headers: {
        "Authorization": this.token,
      },
      ...params,
    });
    if (!resp.ok) {
      console.error("Request failed", { url, response: await resp.text() });
      throw new Error(`${resp.status}: ${resp.statusText}`);
    }
    return resp;
  }

  async getStandups(): Promise<Standup[]> {
    const resp = await this.request("https://api.geekbot.com/v1/standups/");
    return await resp.json() as Standup[];
  }

  async getReports(opts: GetReportOptions): Promise<Report[]> {
    const query = new URLSearchParams({
      question_ids: `${opts.question.id}`,
      user_id: `${opts.user.id}`,
      standup_id: `${opts.standup.id}`,
    });
    if (opts.after) {
      query.set("after", `${opts.after.getTime() / SECOND}`);
    }
    if (opts.before) {
      query.set("before", `${opts.before.getTime() / SECOND}`);
    }
    const resp = await this.request(
      `https://api.geekbot.com/v1/reports/?${query.toString()}`,
    );
    const reports = await resp.json() as Report[];
    return reports.sort((r1, r2) => r1.timestamp - r2.timestamp); 
  }
}

export default Client;
