import { Question, Report, Standup, User } from "./geekbot.ts";

export function renderResults(standup: Standup, user: User, question: Question, reports: Report[]) {
    console.log(`${standup.channel} > ${user.username} > '${question.text}'`)
    reports.forEach(r => {
        if (r.questions.length > 0) {
            console.log('%c' + new Date(r.timestamp * 1000).toLocaleString(), 'color:yellow;font-weight:bold')
            console.log(r.questions.map(({ answer }) => answer).join(''))
        }
    })
}
