const fs = require("fs")
const { WebhookClient, AttachmentBuilder, EmbedBuilder } = require("discord.js")
const Emojis = require("../haren/emojis.json")
const Colors = require("../haren/colors.json")
const Logs = require("../haren/logs.json")
require("advanced-logs")
console.setConfig({
  background: false,
  timestamp: false
})

module.exports.autoSaver = (client) => {
  const Database = fs.readFileSync("./croxydb/croxydb.json", 'utf-8')
  const Zaman = `${new Date().toLocaleDateString()}`    
  const Mesaj = new EmbedBuilder()
    .setColor(Colors.Blurple)
    .setAuthor({name: `${client.user.username} | Database yedeği`, iconURL: client.user.avatarURL()})
    .setDescription(`${Emojis.Ünlem} Yukarıdaki dosyayı indirerek **${Zaman}** tarihli verilere ulaşabilirsiniz.`)
    .setFooter({text: `${Zaman}`})    .setTimestamp()
  client.channels.cache.get(Logs.Yedek).send({embeds: [Mesaj], files: [new AttachmentBuilder(Buffer.from(`${Database}`, "utf-8"), { name: `database-${Zaman}.json`})]
  })
  console.info(``, ` Yedek alındı.`)
}