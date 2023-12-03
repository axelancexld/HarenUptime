const { Discord, EmbedBuilder, ChannelType, ButtonBuilder, ActionRowBuilder, ButtonStyle, ModalBuilder, TextInputStyle, TextInputBuilder, InteractionType, PermissionsBitField } = require ("discord.js")
const Emojis = require("../haren/emojis.json")
const Colors = require("../haren/colors.json")
const { botid } = require("../base/settings.json")
const db = require("croxydb")

module.exports = {
  slash: true, 
  enable: true, 
  dbl: false, 
  name: ['davet'],  
  description: 'Botun bağlantılarını gösterir.',
  
async execute(client, interaction) {
  
  await interaction.deferReply()
  
  const Buton = new ActionRowBuilder()
    .addComponents(new ButtonBuilder()        
      .setURL(`https://discord.com/api/oauth2/authorize?client_id=${botid}&permissions=8&scope=bot%20applications.commands`)
      .setLabel(`Sunucuna ekle`)
      .setStyle("Link"))
    .addComponents(new ButtonBuilder()        
      .setURL(`https://top.gg/bot/${botid}/vote`)
      .setLabel(`Oy ver`)
      .setStyle("Link"))
    .addComponents(new ButtonBuilder()        
      .setURL(`https://discord.gg/XjBRvvaUzM`)
      .setLabel(`Destek sunucusu`)
      .setStyle("Link"))
  const Mesaj = new EmbedBuilder()
    .setColor(Colors.Yellow)
    .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
    .setDescription(`
> ${Emojis.Davet} Beni kullanmayı sevdiysen sunucuna ekleyebilirsin ve bize destek olabilirsin.

> ${Emojis.Destek} Bir öneri, hata bildirmek için veya karalisteye alındıysan açtırmak için destek sunucuma katılabilirsin.

> ${Emojis.Oy} Oy vererek bize destek olabilirsin.
`)
    .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
    .setTimestamp()
  await interaction.followUp({embeds: [Mesaj], components: [Buton]})
  
  }
}