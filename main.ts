#!/usr/bin/env deno run --allow-env --allow-net

import log from './log.ts'
import Geekbot from './geekbot.ts'
import { renderResults } from './output.ts'

const client = new Geekbot(Deno.env.get('GEEKBOT_TOKEN') || log.fatal('GEEKBOT_TOKEN is required'))

const targetStandup = Deno.args[0].toLowerCase()
const targetUser = Deno.args[1].toLowerCase()
const targetQuestion = Deno.args[2].toLowerCase()

const standups = await client.getStandups()
const standup = standups.find(({ channel }) => channel.toLowerCase() === targetStandup) || log.fatal(`No standup ${targetStandup} found`)
const user = standup.users.find(({ username }) => username.toLowerCase() === targetUser) || log.fatal(`No user ${targetUser} found`)
const question = standup.questions.find(({ text }) => text.toLowerCase().includes(targetQuestion)) || log.fatal(`No question ${targetQuestion} found`)

const reports = await client.getReports({ question, user, standup })

renderResults(standup, user, question, reports)

export {}
