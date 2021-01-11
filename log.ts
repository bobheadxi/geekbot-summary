function fatal(...args: any[]) {
    console.error(...args)
    return Deno.exit(1)
}

export default { fatal }
