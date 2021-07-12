import { GetReportOptions, Report } from "./geekbot.ts";
import { SECOND } from "https://deno.land/std@0.100.0/datetime/mod.ts";

export function renderResults(
  reports: Report[],
  { standup, user, question, after, before }: GetReportOptions,
) {
  const headerText =
    `${standup.channel} > ${user.username} > '${question.text}'`.toUpperCase();
  const headerSubtitle = (after || before)
    ? `\n${after ? `from ${after.toLocaleDateString()} ` : ""}until ${
      before ? before.toLocaleDateString() : "now"
    }`
    : "";
  const headerDivider = "\n" + "=".repeat(headerText.length);
  console.log(
    `%c${headerText}${headerSubtitle}${headerDivider}`,
    "color:palegreen;font-weight:bold",
  );

  reports.forEach((r) => {
    if (r.questions.length > 0) {
      console.group(
        `%c${new Date(r.timestamp * SECOND).toLocaleString()}`,
        "color:yellowgreen;font-weight:bold",
      );
      console.log(r.questions.map(({ answer }) => answer).join(""));
      console.groupEnd();
    }
  });
}
