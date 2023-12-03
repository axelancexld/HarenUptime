const { Discord, EmbedBuilder, ChannelType, ButtonBuilder, ActionRowBuilder, ButtonStyle, ModalBuilder, TextInputStyle, TextInputBuilder, InteractionType, PermissionsBitField } = require ("discord.js")
const { prefix, topgg, botid } = require("../base/settings.json")
const Emojis = require("../haren/emojis.json")
const Colors = require("../haren/colors.json")
const db = require("croxydb")

module.exports = {
  name: "messageCreate",
  async execute(message, client, dbl) {
    if (message.author.bot) return
    if (!message.content.startsWith(prefix)) return
    let command = message.content.split(" ")[0].slice(prefix.length)
    let args = message.content.split(" ").slice(1)
    let cmd = client.commands.get(command)
    if (!cmd) return
    
    const Buton = new ActionRowBuilder()
      .addComponents(new ButtonBuilder()        
        .setURL(`https://discord.gg/XjBRvvaUzM`)
        .setLabel(`Destek sunucusu`)
        .setStyle("Link"))  
        
    if(db.fetch(`Karaliste_${message.author.id}`)) {
      const Kullanamazsın = new EmbedBuilder()
        .setColor(Colors.Red)
        .setAuthor({name: message.author.username, iconURL: message.author.avatarURL()}) 
        .setDescription(`${Emojis.Ünlem} \`${db.fetch(`KaralisteSebep`)}\` sebebi ile botun karalistesinde bulunduğun için botu kullanamazsın, karalisteyi açtırmak için destek sunucusuna gelebilirsin.`)
        .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
        .setTimestamp()
      if(message.author.id !== "367982908037791746" && message.author.id !== "367982908037791746" && message.author.id !== "367982908037791746" && message.author.id !== "361508226300248065") {
      await message.reply({embeds: [Kullanamazsın], components: [Buton]})
      }
    }
    
    if(db.fetch(`Bakım`)) {
      const Bakımda = new EmbedBuilder()
        .setColor(Colors.Red)
        .setAuthor({name: message.author.username, iconURL: message.author.avatarURL()}) 
        .setDescription(`${Emojis.Ünlem} Bot şuanda \`${db.fetch(`BakımSebep`)}\` sebebi ile bakımda, daha fazla bilgi için destek sunucusuna gelebilirsiniz.`)
        .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
        .setTimestamp()
      if(message.author.id !== "361508226300248065" && message.author.id !== "361508226300248065" && message.author.id !== "361508226300248065" && message.author.id !== "367982908037791746") {
      await message.reply({embeds: [Bakımda], components: [Buton]})
      }
    }
  
    const Dm = new EmbedBuilder()
      .setColor(Colors.Red)
      .setAuthor({name: message.author.username, iconURL: message.author.avatarURL()}) 
      .setDescription(`${Emojis.Çarpı} Komutlarımı sadece sunucularda kullanabilirsin.`)
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
     if(!message.guild) return await message.reply({embeds: [Dm]})
  
    const Oy = new EmbedBuilder()
      .setColor(Colors.Red)
      .setAuthor({name: message.author.username, iconURL: message.author.avatarURL()}) 
      .setDescription(`${Emojis.Çarpı} Bu komutu kullanabilmek için topgg üzerinden oy vermen gerekiyor.`)
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
        
    const OyVer = new ActionRowBuilder()
      .addComponents(new ButtonBuilder()        
        .setURL(`https://top.gg/bot/${botid}/vote`)
        .setLabel(`Oy ver`)
        .setStyle("Link"))
        
    if (topgg) {
      await dbl.getVotes().then((x) => {
        if (cmd.dbl && !x.filter((y) => y.id === message.author.id).length)
          return message.reply({embeds: [Oy], components: [OyVer]})
        else cmd.execute(client, message, args, dbl)
      })
    } else {
      cmd.execute(client, message, args, dbl)
    }
  }
}