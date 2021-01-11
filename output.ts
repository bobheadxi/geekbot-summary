import { Question, Report, Standup, User } from "./geekbot.ts";

export function renderResults(
  standup: Standup,
  user: User,
  question: Question,
  reports: Report[],
) {
  const headerText =
    `${standup.channel} > ${user.username} > '${question.text}'`.toUpperCase();
  const headerDivider = "=".repeat(headerText.length);
  console.log(
    `%c${headerText}\n${headerDivider}`,
    "color:palegreen;font-weight:bold",
  );

  reports.forEach((r) => {
    if (r.questions.length > 0) {
      console.group(
        `%c${new Date(r.timestamp * 1000).toLocaleString()}`,
        "color:yellowgreen;font-weight:bold",
      );
      console.log(r.questions.map(({ answer }) => answer).join(""));
      console.groupEnd();
    }
  });
}
