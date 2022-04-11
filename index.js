const { Telegraf, Markup } = require('telegraf')
require('dotenv').config()

const help = require('./commands')
const bot = new Telegraf(process.env.KIT_TOKEN)

bot.start((ctx) => ctx.reply(`Привет, ${ctx.message.from.first_name ? ctx.message.from.first_name : 'незнакомец'}!`))
bot.help((ctx) => ctx.reply(help.commands))
bot.command('prices', async (ctx) => {
    try {
        await ctx.replyWithHTML('<b>Цены</b>', Markup.inlineKeyboard(
            [
                [Markup.button.callback('Вариант 1', 'btn_1'), Markup.button.callback('Вариант 2', 'btn_2')],
                [Markup.button.callback('Вариант 3', 'btn_3')],
                [Markup.button.callback('Вариант 4', 'btn_4')]
            ]
        ))
    } catch(e) {
        console.error(e)
    }
})

function addAction(name, location_x, location_y, text) {
    bot.action(name, async (ctx) => {
        try {
            await ctx.answerCbQuery()
            if(location_x !== false || location_y !== false) {
                await ctx.replyWithLocation(location_x, location_y)
            }
            await ctx.replyWithHTML(text, {
                disable_web_page_preview: true
            })
        } catch(e) {
            console.error(e)
        }
    })
}

addAction('btn_1', false, false, help.text_1)
addAction('btn_2', false, false, help.text_2)
addAction('btn_3', false, false, help.text_3)
addAction('btn_4', '57.6278819', '39.8350372', help.text_4)

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))