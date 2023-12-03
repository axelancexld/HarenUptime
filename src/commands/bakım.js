const { Discord, EmbedBuilder, ChannelType, ButtonBuilder, ActionRowBuilder, ButtonStyle, ModalBuilder, TextInputStyle, TextInputBuilder, InteractionType, PermissionsBitField } = require ("discord.js")
const Emojis = require("../haren/emojis.json")
const Colors = require("../haren/colors.json")
const db = require("croxydb")

module.exports = {
  slash: true, 
  enable: true, 
  dbl: false, 
  name: ['bakım'],  
  description: 'HarenUptime bakım sistemi.',
  options: [
    { 
      name: "aç",
      description: "Botu bakıma sokar.", 
      type: 1,
      options: [
        { 
          name: "sebep",
          description: "Bakıma alınma sebebi.", 
          type: 3,
          required: false
        }
      ]
    },
    { 
      name: "kapat",
      description: "Botu bakımdan çıkarır.", 
      type: 1
    }
  ],
    
async execute(client, interaction) {
  
  await interaction.deferReply()
  const Bakım = db.fetch(`Bakım`)
  
  const Sahip = new EmbedBuilder()
    .setColor(Colors.Red)
    .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
    .setDescription(`${Emojis.Çarpı} Bu komutu sadece geliştiriciler kullanabilir.`)
    .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
    .setTimestamp()
  if(interaction.user.id !== "878274777054318602" && interaction.user.id !== "367982908037791746" && interaction.user.id !== "367982908037791746" && interaction.user.id !== "361508226300248065") return await interaction.followUp({embeds: [Sahip]})

  if(interaction.options.getSubcommand() === 'aç') {
  
  const sebep = interaction.options.getString('sebep') || `Sebep belirtilmemiş.`
  
  if(Bakım) {
    const Açık = new EmbedBuilder()
      .setColor(Colors.Red)
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`${Emojis.Çarpı} Bot zaten bakımda.`)
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    await interaction.followUp({embeds: [Açık]})
  } else {
    db.set(`Bakım`, true)
    db.set(`BakımSebep`, sebep)
    const Açıldı = new EmbedBuilder()
      .setColor(Colors.Green)
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`${Emojis.Tik} Bot \`${sebep}\` sebebi ile bakıma alındı.`)
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    await interaction.followUp({embeds: [Açıldı]})
    
    }
  }
  
if(interaction.options.getSubcommand() === 'kapat') {
  if(!Bakım) {
    const Kapalı = new EmbedBuilder()
      .setColor(Colors.Red)
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`${Emojis.Çarpı} Bot zaten bakımda değil.`)
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    await interaction.followUp({embeds: [Kapalı]})
  } else {
    db.delete(`Bakım`)
    db.delete(`BakımSebep`)
    const Kapandı = new EmbedBuilder()
      .setColor(Colors.Green)
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`${Emojis.Tik} Bot bakımdan çıkartıldı.`)
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    await interaction.followUp({embeds: [Kapandı]})
    
      }
    }
  
  }
}