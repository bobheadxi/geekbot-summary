#!/usr/bin/env deno run --allow-env --allow-net

import log from "./log.ts";
import Geekbot from "./geekbot.ts";
import { renderResults } from "./output.ts";
import { cac } from "https://unpkg.com/cac/mod.ts";

const cli = cac("geekbot-summary");
cli.usage("Summary tool for Geekbot reports");
cli.showHelpOnExit = true;
cli.command(
  "<standup> <user> <question>",
  "Summarize your reports for a given question. Questions are matched loosely by looking for a matching substring.",
)
  .example(`${cli.name} distribution-updates robert 'what did you do'`)
  .option("--from <from>", "Show reports from <from> days ago")
  .option("--until <until>", "Show reports until <until> days ago")
  .action(
    async (
      targetStandup: string,
      targetUser: string,
      targetQuestion: string,
      options: { from: number; until: number },
    ) => {
      const client = new Geekbot(
        Deno.env.get("GEEKBOT_TOKEN") || log.fatal("GEEKBOT_TOKEN is required"),
      );
      const standups = await client.getStandups();

      // Get the requested standup, user, and question
      const standup =
        standups.find(({ channel }) =>
          channel.toLowerCase() === targetStandup
        ) ||
        log.fatal(`No standup ${targetStandup} found`);
      const user =
        standup.users.find(({ username }) =>
          username.toLowerCase() === targetUser
        ) ||
        log.fatal(`No user ${targetUser} found`);
      const question =
        standup.questions.find(({ text }) =>
          text.toLowerCase().includes(targetQuestion)
        ) || log.fatal(`No question ${targetQuestion} found`);

      // List the reports with the requested parameters
      const reports = await client.getReports({ question, user, standup });

      renderResults(standup, user, question, reports);
    },
  );

try {
  cli.parse();
} catch (err) {
  log.fatal(`${err.message}`);
}

export {};
