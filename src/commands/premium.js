const { Discord, EmbedBuilder, ChannelType, ButtonBuilder, ActionRowBuilder, ButtonStyle, ModalBuilder, TextInputStyle, TextInputBuilder, InteractionType, PermissionsBitField } = require ("discord.js")
const Emojis = require("../haren/emojis.json")
const Colors = require("../haren/colors.json")
const Logs = require("../haren/logs.json")
const db = require("croxydb")
const moment = require('moment')
require('moment-duration-format')
const ms = require('ms')

module.exports = {
  slash: true, 
  enable: true, 
  dbl: false, 
  name: ['premium'],  
  description: 'HarenUptime premium sistemi.',
  options: [
    { 
      name: "ver",
      description: "Bir kullanıcıya premium verirsiniz.", 
      type: 1,
      options: [
        { 
          name: "verilecek-kullanıcı",
          description: "Premium verilecek kullanıcı.", 
          type: 6,
          required: true
        },
      ]
    },
    { 
      name: "al",
      description: "Bir kullanıcının premiumunu alırsınız.", 
      type: 1,
      options: [
        { 
          name: "alınacak-kullanıcı",
          description: "Premiumu alınacak kullanıcı.", 
          type: 6,
          required: true
        },
      ]
    },
    { 
      name: "kontrol",
      description: "Bir kullanıcının premium üyeliğini kontrol edersiniz.", 
      type: 1,
      options: [
        { 
          name: "bakılacak-kullanıcı",
          description: "Premium üye bilgisine bakılacak kullanıcı.", 
          type: 6,
          required: false
        },
      ]
    },
    { 
      name: "süreli",
      description: "Bir kullanıcıya süreli premium verirsiniz.", 
      type: 1,
      options: [
        { 
          name: "verilecek-kullanıcı",
          description: "Premium verilecek kullanıcı.", 
          type: 6,
          required: true
        },
        { 
          name: "süre",
          description: "Verilecek süre.", 
          type: 3,
          required: true
        },
      ]
    },
    { 
      name: "liste",
      description: "Premium kullanıcıları listeler.", 
      type: 1
    }
  ],
    
async execute(client, interaction) {
  
  await interaction.deferReply()
  
  if(interaction.options.getSubcommand() === 'ver') {
   
  const Sahip = new EmbedBuilder()
    .setColor(Colors.Red)
    .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
    .setDescription(`${Emojis.Çarpı} Bu komutu sadece geliştiriciler kullanabilir.`)
    .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
    .setTimestamp()
  if(interaction.user.id !== "1143848125262483466" && interaction.user.id !== "367982908037791746" && interaction.user.id !== "361508226300248065" && interaction.user.id !== "821007648106741770") return await interaction.followUp({embeds: [Sahip]})

  const kullanıcı = interaction.options.getUser('verilecek-kullanıcı')
 
  const Premium = db.fetch(`PremiumÜye_${kullanıcı.id}`)
  if(!Premium) {
    db.set(`PremiumÜye_${kullanıcı.id}`, true)
    db.add(`PremiumSayı`, 1)
    db.push(`Premiumlar`, kullanıcı.id)
    const PremiumLog = new EmbedBuilder()
      .setColor(Colors.Green)
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`> Bir kullanıcıya premium üyeliği verildi.`)
      .addFields(
        {
          name: `${Emojis.Kullanıcı} Kullanıcı bilgileri`, 
          value: `> ${kullanıcı} \`${kullanıcı.tag}\` \`(${kullanıcı.id})\``
        },
        {
          name: `${Emojis.Yetkili} Yetkili bilgileri`, 
          value: `> ${interaction.user} \`${interaction.user.tag}\` \`(${interaction.user.id})\``
        })
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    client.channels.cache.get(Logs.Premium).send({embeds: [PremiumLog]})
    const Eklendi = new EmbedBuilder()
      .setColor(Colors.Green)
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`${Emojis.Tik} ${kullanıcı} adlı kullanıcıya süresiz premium üyeliği verildi.`)
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    await interaction.followUp({embeds: [Eklendi]})
    
  } else {
    const Var = new EmbedBuilder()
      .setColor(Colors.Red)
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`${Emojis.Çarpı} ${kullanıcı} adlı kullanıcının zaten premium üyeliği bulunuyor.`)
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    await interaction.followUp({embeds: [Var]})
    
    }
  }
  
  
  if(interaction.options.getSubcommand() === 'al') {
   
  const Sahip = new EmbedBuilder()
    .setColor(Colors.Red)
    .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
    .setDescription(`${Emojis.Çarpı} Bu komutu sadece geliştiriciler kullanabilir.`)
    .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
    .setTimestamp()
  if(interaction.user.id !== "361508226300248065" && interaction.user.id !== "361508226300248065" && interaction.user.id !== "367982908037791746" && interaction.user.id !== "878274777054318602") return await interaction.followUp({embeds: [Sahip]})

  const kullanıcı = interaction.options.getUser('alınacak-kullanıcı')
 
  const Premium = db.fetch(`PremiumÜye_${kullanıcı.id}`)
  if(Premium) {
    db.delete(`PremiumÜye_${kullanıcı.id}`)
    db.subtract(`PremiumSayı`, 1)
    db.unpush(`Premiumlar`, kullanıcı.id)
    const PremiumLog = new EmbedBuilder()
      .setColor(Colors.Red)
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`> Bir kullanıcının premium üyeliği alındı.`)
      .addFields(
        {
          name: `${Emojis.Kullanıcı} Kullanıcı bilgileri`, 
          value: `> ${kullanıcı} \`${kullanıcı.tag}\` \`(${kullanıcı.id})\``
        },
        {
          name: `${Emojis.Yetkili} Yetkili bilgileri`, 
          value: `> ${interaction.user} \`${interaction.user.tag}\` \`(${interaction.user.id})\``
        })
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    client.channels.cache.get(Logs.Premium).send({embeds: [PremiumLog]})
    const Alındı = new EmbedBuilder()
      .setColor(Colors.Green)
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`${Emojis.Tik} ${kullanıcı} adlı kullanıcının premium üyeliği alındı.`)
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    await interaction.followUp({embeds: [Alındı]})
    
  } else {
    const Yok = new EmbedBuilder()
      .setColor(Colors.Red)
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`${Emojis.Çarpı} ${kullanıcı} adlı kullanıcının zaten premium üyeliği bulunmuyor.`)
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    await interaction.followUp({embeds: [Yok]})
    
    }
  }
  
  
  if(interaction.options.getSubcommand() === 'liste') {
   
  const Sahip = new EmbedBuilder()
    .setColor(Colors.Red)
    .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
    .setDescription(`${Emojis.Çarpı} Bu komutu sadece geliştiriciler kullanabilir.`)
    .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
    .setTimestamp()
  if(interaction.user.id !== "367982908037791746" && interaction.user.id !== "878274777054318602" && interaction.user.id !== "361508226300248065" && interaction.user.id !== "367982908037791746") return await interaction.followUp({embeds: [Sahip]})
    
    var allPremium = []
      
      db.fetch(`Premiumlar`, []).forEach(data => {
          allPremium.push(data)
      })
    
  const PreListe = new EmbedBuilder()
    .setColor(Colors.Yellow)
    .setAuthor({name: interaction.user.username, iconURL: interaction.user.displayAvatarURL()}) 
    .setDescription(`> HarenUptime premium üyelerin listesi`)
    .addFields(
      {
        name: `${Emojis.Elmas} Premium üyeler (${db.fetch(`PremiumSayı`) || 0})`,
        value: `<@${allPremium.join(">\n<@")}>`
      })
    .setFooter({text: client.user.username, iconURL: client.user.displayAvatarURL()}) 
    .setTimestamp()
  await interaction.followUp({embeds: [PreListe]})
  }
  
  
  if(interaction.options.getSubcommand() === 'kontrol') {
   
  const kullanıcı = interaction.options.getUser('bakılacak-kullanıcı') || interaction.user
 
  const Premium = db.fetch(`PremiumÜye_${kullanıcı.id}`)
  
  if(Premium) {
    const Var = new EmbedBuilder()
      .setColor(Colors.Green)
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`${Emojis.Tik} ${kullanıcı} adlı kullanıcının premium üyeliği bulunuyor. Bitiş zamanı: \`${db.fetch(`SüreliPremium_${kullanıcı.id}`) || `Süresiz`}\``)
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    await interaction.followUp({embeds: [Var]})
  } else {
      const Yok = new EmbedBuilder()
      .setColor(Colors.Red)
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`${Emojis.Çarpı} ${kullanıcı} adlı kullanıcının premium üyeliği bulunmuyor.`)
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    await interaction.followUp({embeds: [Yok]})
  }    
  }
  
  
  if(interaction.options.getSubcommand() === 'süreli') {
   
  const Sahip = new EmbedBuilder()
    .setColor(Colors.Red)
    .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
    .setDescription(`${Emojis.Çarpı} Bu komutu sadece geliştiriciler kullanabilir.`)
    .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
    .setTimestamp()
  if(interaction.user.id !== "361508226300248065" && interaction.user.id !== "878274777054318602" && interaction.user.id !== "367982908037791746" && interaction.user.id !== "361508226300248065") return await interaction.followUp({embeds: [Sahip]})

  const kullanıcı = interaction.options.getUser('verilecek-kullanıcı')
  const süre = interaction.options.getString('süre')
 
  const Premium = db.fetch(`PremiumÜye_${kullanıcı.id}`)
  if(Premium) {
    const Var = new EmbedBuilder()
      .setColor(Colors.Red)
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`${Emojis.Çarpı} ${kullanıcı} adlı kullanıcının zaten premium üyeliği bulunuyor.`)
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    await interaction.followUp({embeds: [Var]})
  } else {
    let PremiumBitiş = Date.now() + ms(süre.replace('gün', 'day').replace('saat', 'hours').replace('hafta', 'week'))
      db.set(`PremiumÜye_${kullanıcı.id}`, true)
      db.add(`PremiumSayı`, 1)
      db.set(`SüreliPremium_${kullanıcı.id}`, moment(PremiumBitiş).format('DD.MM.YYYY - HH:mm:ss')) 
      db.push(`Premiumlar`, kullanıcı.id)
    const PremiumLog = new EmbedBuilder()
      .setColor(Colors.Green)
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`> Bir kullanıcıya premium üyeliği verildi.`)
      .addFields(
        {
          name: `${Emojis.Kullanıcı} Kullanıcı bilgileri`, 
          value: `> ${kullanıcı} \`${kullanıcı.tag}\` \`(${kullanıcı.id})\``
        },
        {
          name: `${Emojis.Yetkili} Yetkili bilgileri`, 
          value: `> ${interaction.user} \`${interaction.user.tag}\` \`(${interaction.user.id})\``
        },
        {
          name: `${Emojis.Uptime} Premium bitiş zamanı`,
          value: `> ${moment(PremiumBitiş).format('DD.MM.YYYY - HH:mm:ss')}`
        })
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    client.channels.cache.get(Logs.Premium).send({embeds: [PremiumLog]})
    const Verildi = new EmbedBuilder()
      .setColor(Colors.Green)
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`${Emojis.Tik} ${kullanıcı} adlı kullanıcıya \`${süre}\` süreli premium verildi. Bitiş zamanı: ${moment(PremiumBitiş).format('DD.MM.YYYY - HH:mm:ss')}`)
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    await interaction.followUp({embeds: [Verildi]})
    
    setTimeout(() => {
        
      db.delete(`PremiumÜye_${kullanıcı.id}`)
      db.delete(`SüreliPremium_${kullanıcı.id}`)
      db.subtract(`PremiumSayı`, 1)
      db.unpush(`Premiumlar`, kullanıcı.id)
     
      const PremiumLog = new EmbedBuilder()
      .setColor(Colors.Red)
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`> Bir kullanıcının premium üyeliğinin süresi sona erdi.`)
      .addFields(
        {
          name: `${Emojis.Kullanıcı} Kullanıcı bilgileri`, 
          value: `> ${kullanıcı} \`${kullanıcı.tag}\` \`(${kullanıcı.id})\``
        })
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    client.channels.cache.get(Logs.Premium).send({embeds: [PremiumLog]})
    }, ms(süre.replace('gün', 'day').replace('saat', 'hours').replace('hafta', 'week')))
  }
  }
    
    
  }
}