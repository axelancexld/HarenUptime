const { Discord, EmbedBuilder, ChannelType, ButtonBuilder, ActionRowBuilder, ButtonStyle, ModalBuilder, TextInputStyle, TextInputBuilder, InteractionType, PermissionsBitField } = require ("discord.js")
const Emojis = require("../haren/emojis.json")
const Colors = require("../haren/colors.json")
const fetch = require("fetch")
const db = require("croxydb")
const { topgg, botid } = require("../base/settings.json")

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client, dbl) {
      
    if (interaction.type !== InteractionType.ApplicationCommand) {
    } else {
      const command = client.slashcommands.get(interaction.commandName)
      if (!command) return
      try {
        
        const Buton = new ActionRowBuilder()
          .addComponents(new ButtonBuilder()        
            .setURL(`https://discord.gg/XjBRvvaUzM`)
            .setLabel(`Destek sunucusu`)
            .setStyle("Link"))  
        
        if(db.fetch(`Karaliste_${interaction.user.id}`)) {
          const Kullanamazsın = new EmbedBuilder()
            .setColor(Colors.Red)
            .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
            .setDescription(`${Emojis.Ünlem} \`${db.fetch(`KaralisteSebep_${interaction.user.id}`)}\` sebebi ile botun karalistesinde bulunduğun için botu kullanamazsın, karalisteyi açtırmak için destek sunucusuna gelebilirsin.`)
            .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
            .setTimestamp()
          if(interaction.user.id !== "367982908037791746" && interaction.user.id !== "367982908037791746" && interaction.user.id !== "361508226300248065" && interaction.user.id !== "367982908037791746") return await interaction.reply({embeds: [Kullanamazsın], components: [Buton]})
        }
        
        if(db.fetch(`Bakım`)) {
          const Bakımda = new EmbedBuilder()
            .setColor(Colors.Red)
            .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
            .setDescription(`${Emojis.Ünlem} Bot şuanda \`${db.fetch(`BakımSebep`)}\` sebebi ile bakımda, daha fazla bilgi için destek sunucusuna gelebilirsiniz.`)
            .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
            .setTimestamp()
          if(interaction.user.id !== "361508226300248065" && interaction.user.id !== "361508226300248065" && interaction.user.id !== "367982908037791746" && interaction.user.id !== "361508226300248065") return await interaction.reply({embeds: [Bakımda], components: [Buton]})
        }
  
        const Dm = new EmbedBuilder()
          .setColor(Colors.Red)
          .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
          .setDescription(`${Emojis.Çarpı} Komutlarımı sadece sunucularda kullanabilirsin.`)
          .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
          .setTimestamp()
        if(!interaction.guild) return await interaction.reply({embeds: [Dm]})
  
        const Oy = new EmbedBuilder()
          .setColor(Colors.Red)
          .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
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
            if (command.dbl && !x.filter((y) => y.id === interaction.user.id).length)
              return interaction.reply({embeds: [Oy], components: [OyVer]})
            else command.execute(client, interaction, dbl)
          })
        } else {
          command.execute(client, interaction, dbl)
        }
      } catch (error) {
        console.error(error)
        const Hata = new EmbedBuilder()
          .setColor(Colors.Red)
          .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
          .setDescription(`${Emojis.Çarpı} Komut çalıştırılırken bir hata oluştu.`)
          .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
          .setTimestamp()
        interaction.reply({embeds: [Hata]})
      }
    }
  }
}
