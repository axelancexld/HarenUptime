const { Discord, EmbedBuilder, ChannelType, ButtonBuilder, ActionRowBuilder, ButtonStyle, ModalBuilder, TextInputStyle, TextInputBuilder, InteractionType, PermissionsBitField } = require ("discord.js")
const Emojis = require("../haren/emojis.json")
const Colors = require("../haren/colors.json")
const db = require("croxydb")

module.exports = {
  slash: true, 
  enable: true, 
  dbl: false, 
  name: ['istatistik'],  
  description: 'Botun istatistiklerini gösterir.',
  
async execute(client, interaction) {
  
  await interaction.deferReply()
  
  const Linkler = db.fetch(`UptimeLink`) 
  const Uptime = db.fetch(`UptimeLink_${interaction.user.id}`) 
  const LinkLimit = db.fetch(`LinkLimit_${interaction.user.id}`) || 0
  let Limit = LinkLimit+3
  let Uptimeler
  if(!Uptime) {
    Uptimeler = 0
  } else {
    Uptimeler = `${db.fetch(`UptimeLink_${interaction.user.id}`).length || 0}`
  }
  let TümUptimeler
  if(!Linkler) {
    TümUptimeler = 0
  } else {
    TümUptimeler = `${db.fetch(`UptimeLink`).length || 0}`
  }
  
  let gün = Math.floor(client.uptime / 86400000)
  let saat = Math.floor(client.uptime / 3600000) % 24
  let dakika = Math.floor(client.uptime / 60000) % 60
  let saniye = Math.floor(client.uptime / 1000) % 60
      
  const İst = new EmbedBuilder()
    .setColor(Colors.Yellow)
    .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
    .addFields(
      {
        name: `${Emojis.Geliştirici} Geliştiriciler`,
        value: `> **[Billy](https://discord.com/users/1163784982075031582)**`,
        inline: true
      },
      {
        name: `${Emojis.Taç} Kurucular`,
        value: `> **[shx](https://discord.com/users/367982908037791746)**\n> **[Leamord](https://discord.com/users/361508226300248065)**`,
        inline: true
      },
      {
        name: `${Emojis.Kütüphane} Kütüphane`,
        value: `> v14.8.0`,
        inline: true
      },
      {
        name: `${Emojis.Node} Node.js`,
        value: `> v16.14.2`,
        inline: true
      },
      {
        name: `${Emojis.Uptime} Çalışma süresi`,
        value: `> <t:${Math.floor( Date.now() / 1000 - interaction.client.uptime / 1000)}:R>`,
        inline: true
      },
      {
        name: `${Emojis.Sunucu} Toplam sunucular`,
        value: `> ${client.guilds.cache.size}`,
        inline: true
      },
      {
        name: `${Emojis.Kullanıcı} Toplam kullanıcılar`,
        value: `> ${interaction.client.guilds.cache.reduce((a,b)=> a + b.memberCount, 0)}`,
        inline: true
      },
      {
        name: `${Emojis.Bulut} Ram kullanımı`,
        value: `> ${(process.memoryUsage().heapUsed / 2024 / 2024).toFixed(2)}mb`,
        inline: true
      },
      {
        name: `${Emojis.Belge} Toplam link sayısı`,
        value: `> ${TümUptimeler}`,
        inline: true
      },
      {
        name: `${Emojis.Link} Senin link sayın`,
        value: `> ${Uptimeler}`,
        inline: true
      },
      {
        name: `${Emojis.Elmas} Toplam premium üyeler`,
        value: `> ${db.fetch(`PremiumSayı`) || 0}`,
        inline: true
      },
      {
        name: `${Emojis.Sınır} Link ekleme hakkın`,
        value: `> ${Limit}`,
        inline: true
      })
    .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
    .setTimestamp()
  await interaction.followUp({embeds: [İst]})
  
  }
}