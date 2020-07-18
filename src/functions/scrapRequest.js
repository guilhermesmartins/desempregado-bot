async function scrapRequest(website, msg, ctx) {
    await website.initialize()
    await website.pageNavigation(msg, ctx)
    let resp = await website.pageJobs()
    await website.end()
    console.log(resp)
    return resp
}

module.exports = scrapRequest