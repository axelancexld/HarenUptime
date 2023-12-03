const { Discord, EmbedBuilder, ChannelType, ButtonBuilder, ActionRowBuilder, ButtonStyle, ModalBuilder, TextInputStyle, TextInputBuilder, InteractionType, PermissionsBitField, StringSelectMenuBuilder, SlashCommandBuilder, ContextMenuCommandBuilder, ApplicationCommandType } = require ("discord.js")
const db = require("croxydb")
const Emojis = require("../haren/emojis.json")
const Colors = require("../haren/colors.json")
const Logs = require("../haren/logs.json")

module.exports = {
  slash: true, 
  enable: true, 
  dbl: false, 
  name: ['para'],  
  description: 'Para ayarlarını yaparsınız.',
  options: [
    { 
      name: "ekle",
      description: "Bir kullanıcıya para eklersiniz.", 
      type: 1,
      options: [
        { 
          name: "kullanıcı",
          description: "Para eklenecek kullanıcı.", 
          type: 6,
          required: true
        },
        { 
          name: "miktar",
          description: "Verilecek para miktarı.", 
          type: 10,
          required: true
        }
      ]
    },
    { 
      name: "al",
      description: "Bir kullanıcıdan para alırsınız.", 
      type: 1,
      options: [
        { 
          name: "kullanıcı",
          description: "Para alınacak kullanıcı.", 
          type: 6,
          required: true
        },
        { 
          name: "miktar",
          description: "Alınacak para miktarı.", 
          type: 10,
          required: true
        }
      ]
    },
  ],

async execute(client, interaction) { 
  
  await interaction.deferReply()
  
  const Sahip = new EmbedBuilder()
    .setColor(Colors.Red)
    .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
    .setDescription(`${Emojis.Çarpı} Bu komutu sadece geliştiriciler kullanabilir.`)
    .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
    .setTimestamp()
  if(interaction.user.id !== "873182701061021696" && interaction.user.id !== "367982908037791746" && interaction.user.id !== "361508226300248065") return await interaction.followUp({embeds: [Sahip]})
  
  if(interaction.options.getSubcommand() === 'ekle') {
    const Kullanıcı = interaction.options.getUser('kullanıcı') 
    const Miktar = interaction.options.getNumber('miktar') 
    const Bakiye = db.fetch(`Bakiye_${Kullanıcı.id}`) || 0
  
    const ParaAz = new EmbedBuilder()
      .setColor(Colors.Red)
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`${Emojis.Çarpı} Verilecek para miktarı 0 değerinden büyük olmalı.`)
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    if(Miktar <= 0) return await interaction.followUp({embeds: [ParaAz]})
      
    db.add(`Bakiye_${Kullanıcı.id}`, Miktar)
    
    const Eklendi = new EmbedBuilder()
      .setColor(Colors.Green)
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`${Emojis.Tik} ${Kullanıcı} adlı kullanıcının bakiyesine **${Miktar} HC** eklendi.`)
       .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    await interaction.followUp({embeds: [Eklendi]})
  }
  
  if(interaction.options.getSubcommand() === 'al') {
    const Kullanıcı = interaction.options.getUser('kullanıcı') 
    const Miktar = interaction.options.getNumber('miktar') 
    const Bakiye = db.fetch(`Bakiye_${Kullanıcı.id}`) || 0
  
    const ParaYok = new EmbedBuilder()
      .setColor(Colors.Red)
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`${Emojis.Çarpı} Bu kullanıcının bakiyesinde **${Miktar} HC** bulunmuyor.`)
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    if(Miktar > Bakiye) return await interaction.followUp({embeds: [ParaYok]})
    
    const ParaAz = new EmbedBuilder()
      .setColor(Colors.Red)
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`${Emojis.Çarpı} Alınacak para miktarı 0 değerinden büyük olmalı.`)
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    if(Miktar <= 0) return await interaction.followUp({embeds: [ParaAz]})
    
    db.subtract(`Bakiye_${Kullanıcı.id}`, Miktar)
    
    const Alındı = new EmbedBuilder()
      .setColor(Colors.Green)
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`${Emojis.Tik} ${Kullanıcı} adlı kullanıcının bakiyesinden **${Miktar} HC** alındı.`)
       .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    await interaction.followUp({embeds: [Alındı]})
  }
  
  }
}