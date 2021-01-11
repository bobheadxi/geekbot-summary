// https://geekbot.com/developers

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

  async getReports(
    opts: {
      question: Question;
      user: User;
      standup: Standup;
      from?: Date;
      until?: Date;
    },
  ): Promise<Report[]> {
    const query = new URLSearchParams({
      question_ids: `${opts.question.id}`,
      user_id: `${opts.user.id}`,
      standup_id: `${opts.standup.id}`,
      from: `${opts.from?.getUTCSeconds()}`,
      until: `${opts.until?.getUTCSeconds()}`,
    });
    const resp = await this.request(
      `https://api.geekbot.com/v1/reports/?${query.toString()}`,
    );
    return await resp.json() as Report[];
  }
}

export default Client;
