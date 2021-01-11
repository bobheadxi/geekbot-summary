#!/usr/bin/env deno run --allow-env --allow-net

import log from './log.ts'

const params: RequestInit = {
    headers: {
        'Authorization': Deno.env.get('GEEKBOT_TOKEN') || ''
    },
}

const targetStandup = Deno.args[0].toLowerCase()
const targetUser = Deno.args[1].toLowerCase()
const targetQuestion = Deno.args[2].toLowerCase()

type Question = { id: number, text: string }
type User = { id: string, username: string }
type Standup = { id: number, channel: string, questions: Question[], users: User[] }
const standups: Standup[] = await (await fetch('https://api.geekbot.com/v1/standups/', params)).json()
const standup = standups.find(({ channel }) => channel.toLowerCase() === targetStandup) || log.fatal(`No standup ${targetStandup} found`)
const user = standup.users.find(({ username }) => username.toLowerCase() === targetUser) || log.fatal(`No user ${targetUser} found`)
const question = standup.questions.find(({ text }) => text.toLowerCase().includes(targetQuestion)) || log.fatal(`No question ${targetQuestion} found`)

console.log(`${standup.channel} | ${user.username} | ${question.text}`)

type Answer = { answer: string }
type Report = { timestamp: number, questions: Answer[] }
const reports: Report[] = await (await fetch(`https://api.geekbot.com/v1/reports/?question_ids=${question.id}&user_id=${user.id}&standup_id=${standup.id}`, params)).json()

reports.forEach(r => {
    if (r.questions.length > 0) {
        console.log('====')
        console.log(r.timestamp)
        console.log(r.questions.map(({ answer }) => answer).join(''))
    }
})

export {}
