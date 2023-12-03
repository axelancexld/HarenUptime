const { Discord, EmbedBuilder, ChannelType, ButtonBuilder, ActionRowBuilder, ButtonStyle, ModalBuilder, TextInputStyle, TextInputBuilder, InteractionType, PermissionsBitField } = require ("discord.js")
const Emojis = require("../haren/emojis.json")
const Colors = require("../haren/colors.json")
const db = require("croxydb")
const Bekle = require('node:timers/promises').setTimeout

module.exports = {
  slash: true, 
  enable: true, 
  dbl: false, 
  name: ['ping'],  
  description: 'Botun gecikme sürelerini gösterir.',
  
async execute(client, interaction) {
  
  await interaction.deferReply()
  
  const PingHesaplanıyor = new EmbedBuilder()
    .setColor(Colors.Yellow)
    .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
    .setDescription(`${Emojis.Uptime} Gecikme süreleri hesaplanıyor.`)
    .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
    .setTimestamp()
  const Hesap = await interaction.followUp({embeds: [PingHesaplanıyor], fetchReply: true})
    
  let Mesaj = Hesap.createdTimestamp - interaction.createdTimestamp
  let Ping = client.ws.ping
  
  let Değer
  if(Ping < 50) Değer = `${Colors.Green}`
  if(Ping >= 50 && Ping < 100) Değer = `${Colors.Yellow}`
  if(Ping >= 100 && Ping < 500) Değer = `${Colors.Red}`
  if(Ping >= 500) Değer = `${Colors.Black}`
    
  let Emoji
  if(Ping < 50) Emoji = `${Emojis.Ping}`
  if(Ping >= 50 && Ping < 100) Emoji = `${Emojis.Ping2}`
  if(Ping >= 100 && Ping < 500) Emoji = `${Emojis.Ping3}`
  if(Ping >= 500) Emoji = `${Emojis.Ping4}`
   
  await Bekle(3000)
  const PingMesaj = new EmbedBuilder()
    .setColor(Değer)
    .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
    .addFields(
      {
        name: `${Emoji} Bot gecikmesi`,
        value: `> ${Ping}ms`
      },
      {
        name: `${Emojis.Bot} Mesaj gecikmesi`,
        value: `> ${Mesaj}ms`
      })
    .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
    .setTimestamp()
  await interaction.editReply({embeds: [PingMesaj]})
  
  }
}