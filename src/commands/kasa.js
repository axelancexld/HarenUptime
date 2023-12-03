const { Discord, EmbedBuilder, ChannelType, ButtonBuilder, ActionRowBuilder, ButtonStyle, ModalBuilder, TextInputStyle, TextInputBuilder, InteractionType, PermissionsBitField, StringSelectMenuBuilder, SlashCommandBuilder, ContextMenuCommandBuilder, ApplicationCommandType } = require ("discord.js")
const db = require("croxydb")
const Emojis = require("../haren/emojis.json")
const Colors = require("../haren/colors.json")
const Logs = require("../haren/logs.json")


module.exports = {
  slash: true, 
  enable: true, 
  dbl: false, 
  name: ['kasa'],  
  description: 'Kasa açarsınız.',

async execute(client, interaction) { 
  
  await interaction.deferReply()
  
  var Paralar = ['32', '33', '34', '35','36','37','38','39','40','41','42','43','44','45']
  var Kazanılan = Paralar[Math.floor(Math.random() * Paralar.length)]
  const Bakiye = db.fetch(`Bakiye_${interaction.user.id}`) || 0
   
  const ParaYok = new EmbedBuilder()
    .setColor(Colors.Red)
    .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
    .setDescription(`${Emojis.Çarpı} Kasa açmak için **40 HC** gerekli.`)
    .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
    .setTimestamp()
  if(Bakiye < 40) return await interaction.followUp({embeds: [ParaYok]})
  
  db.subtract(`Bakiye_${interaction.user.id}`, 40)
  db.add(`Bakiye_${interaction.user.id}`, Kazanılan)
  
  const Açıldı = new EmbedBuilder()
    .setColor(Colors.Yellow)
    .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
    .setDescription(`
> ${Emojis.Kasa} Kasa açıldı.

> ${Emojis.Para} Kazanılan para: **${Kazanılan} HC**  -  Kazanç: **${Kazanılan-40} HC**
`)
    .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
    .setTimestamp()
  await interaction.followUp({embeds: [Açıldı]})
  
  
  }
}