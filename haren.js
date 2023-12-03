const { Discord, EmbedBuilder, ChannelType, ButtonBuilder, ActionRowBuilder, ButtonStyle, ModalBuilder, TextInputStyle, TextInputBuilder, InteractionType, PermissionsBitField, Events, Client, Partials, GatewayIntentBits, } = require("discord.js")

const client = new Client({intents: [GatewayIntentBits.Guilds ]})

const { token } = require("./src/base/settings.json")

const db = require("croxydb")

require("./src/base/app.js")(client)

client.login(token)

const Emojis = require("./src/haren/emojis.json")

const Colors = require("./src/haren/colors.json")

const Logs = require("./src/haren/logs.json")

const fetch = require('node-fetch2')

const request = require("request")

require("advanced-logs")

console.setConfig({

  background: false,

  timestamp: false

})

//=====// Eklendim \\=====\\
client.on('guildCreate', sunucu => {
  const Eklendim = new EmbedBuilder()
     .setColor(Colors.Green)
     .setAuthor({name: sunucu.name, iconURL: sunucu.iconURL()}) 
     .setDescription(`> Bir sunucuya eklendim`)
     .addFields(
       {
         name: `${Emojis.Pusula} Sunucu bilgileri`,
         value: `> ${sunucu} \`(${sunucu.id})\``
       },
       {
         name: `${Emojis.Taç} Sunucu sahibi bilgileri`,
         value: `> ${client.users.cache.get(sunucu.ownerId).tag} \`(${sunucu.ownerId})\``
       },
       {
         name: `${Emojis.Sunucu} Toplam sunucu sayısı`,
         value: `> ${client.guilds.cache.size}`
       },
       {
         name: `${Emojis.Kullanıcı} Sunucudaki kullanıcı sayısı`,
         value: `> ${sunucu.memberCount}`
       })
    .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
    .setTimestamp()
  client.channels.cache.get(Logs.EklendimAtıldım).send({embeds: [Eklendim]})
})
//=====// Eklendim \\=====\\

//=====// Atıldım \\=====\\
client.on('guildDelete', async (sunucu) => {
    try {
  const Atıldım = new EmbedBuilder()
    .setColor(Colors.Red)
    .setAuthor({name: sunucu.name, iconURL: sunucu.iconURL()}) 
    .setDescription(`> Bir sunucudan atıldım`)
    .addFields(
      {
        name: `${Emojis.Pusula} Sunucu bilgileri`,
        value: `> ${sunucu} \`(${sunucu.id})\``
      },
      {
        name: `${Emojis.Taç} Sunucu sahibi bilgileri`,
        value: `> ${client.users.cache.get(sunucu.ownerId).username} \`(${sunucu.ownerId})\``
      },
      {
        name: `${Emojis.Sunucu} Toplam sunucu sayısı`,
        value: `> ${client.guilds.cache.size}`
      },
      {
        name: `${Emojis.Kullanıcı} Sunucudaki kullanıcı sayısı`,
        value: `> ${sunucu.memberCount}`
      })
    .setFooter({text: client.user.username, iconURL: client.user.displayAvatarURL()}) 
    .setTimestamp()
  await client.channels.cache.get(Logs.EklendimAtıldım).send({embeds: [Atıldım]})
    } catch (e) {
        console.error(e)
    }
})
//=====// Atıldım \\=====\\

//=====// Hata log \\=====\\
process.on("unhandledRejection", hata => { 
  const Hata = new EmbedBuilder()
    .setColor(Colors.Red)
    .setDescription(`> Bot bir hata verdi.\n\n> \`${hata}\``) 
    .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
    .setTimestamp()
  client.channels.cache.get(Logs.Hata).send({embeds: [Hata]}) 
})
process.on("uncaughtException", hata => { 
  const Hata2 = new EmbedBuilder()
    .setColor(Colors.Red)
    .setDescription(`> Bot bir hata verdi.\n\n> \`${hata}\``) 
    .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
    .setTimestamp()
  client.channels.cache.get(Logs.Hata).send({embeds: [Hata2]}) 
})
process.on("uncaughtExceptionMonitor", hata => {
  const Hata3 = new EmbedBuilder()
    .setColor(Colors.Red)
    .setDescription(`> Bot bir hata verdi.\n\n> \`${hata}\``) 
    .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
    .setTimestamp()
  client.channels.cache.get(Logs.Hata).send({embeds: [Hata3]}) 
}) 
//=====// Hata log \\=====\\

//=====// Uptime \\=====\\

setInterval(() => {
  const Linkler = db.fetch("UptimeLink")
  if(!Linkler) return
  Linkler.forEach(link => {
    try {
      fetch(link)
    } catch (e) {
      const UptimeHata = new EmbedBuilder()
       .setColor(Colors.Red)
       .setDescription(`> Uptime yapılırken bir hata oluştu. \n\n> \`${e}\``) 
       .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
       .setTimestamp()
      client.channels.cache.get(Logs.Hata).send({embeds: [UptimeHata]}) 
    }
  })
}, 120000)

setInterval(() => {
  const Linkler = db.fetch("UptimeLink")
  if(!Linkler) return
  Linkler.forEach(link => {
    try {
      request(link)
    } catch (e) {
      const UptimeHata = new EmbedBuilder()
       .setColor(Colors.Red)
       .setDescription(`> Uptime yapılırken bir hata oluştu. \n\n> \`${e}\``) 
       .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
       .setTimestamp()
      client.channels.cache.get(Logs.Hata).send({embeds: [UptimeHata]}) 
    }
  })
}, 120000)
//=====// Uptime \\=====\\

//=====// Link ekle \\=====\\
client.on('interactionCreate', async interaction => {
if(!interaction.isButton()) return
if(interaction.customId === "ekle") {
  const LinkEklemeFormu = new ModalBuilder()
  .setCustomId('linkeklemeform2')
  .setTitle('Link ekle')
const LinkEkleFormu = new TextInputBuilder()
  .setCustomId('linkekle')
  .setLabel('Proje adresinizi giriniz')
  .setStyle(TextInputStyle.Paragraph)
  .setMinLength(20)
  .setMaxLength(100)
  .setPlaceholder('https://proje-linki.glitch.me')
  .setRequired(true)
const LinkEklemeSistemi = new ActionRowBuilder().addComponents(LinkEkleFormu)
  LinkEklemeFormu.addComponents(LinkEklemeSistemi)
    
    await interaction.showModal(LinkEklemeFormu)
    await interaction.awaitModalSubmit({ filter: (interaction) => interaction.customId === `linkeklemeform2`, time: 60 * 60 * 1000 }).then(async (interaction) => {
    const LinkLimit = db.fetch(`LinkLimit_${interaction.user.id}`) || 0
    let Limit = LinkLimit+3
    await interaction.deferUpdate()
    const link = interaction.fields.getTextInputValue("linkekle")
    let Linkler = db.fetch(`UptimeLink_${interaction.user.id}`, []) || []
    const PremiumÜye = db.fetch(`PremiumÜye_${interaction.user.id}`)

    if(!db.fetch(`UptimeLink_${interaction.user.id}`)) {
      db.set(`UptimeLink_${interaction.user.id}`, [])
    }
    if(PremiumÜye) {
    if(db.fetch(`UptimeLink_${interaction.user.id}`, []).length >= 30) {
    const FazlaLink = new EmbedBuilder()
      .setColor(Colors.Red)
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`${Emojis.Çarpı} Bir kullanıcı tarafından en fazla 30 link eklenebilir.`)
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    return await interaction.followUp({embeds: [FazlaLink], ephemeral: true})
    }
    } else {
    if(db.fetch(`UptimeLink_${interaction.user.id}`, []).length >= Limit) {
    const PreYok = new EmbedBuilder()
      .setColor(Colors.Red)
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()})
      .setDescription(`${Emojis.Çarpı} Premium üyeliğin bulunmadığı için en fazla ${Limit} link ekleyebilirsin.`)
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    return interaction.followUp({embeds: [PreYok], ephemeral: true})
      }
    }
    if(Linkler.includes(link)) {
    const LinkVar = new EmbedBuilder()
      .setColor(Colors.Red)
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`${Emojis.Çarpı} Belirtilen link zaten sistemde bulunuyor.`)
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    return await interaction.followUp({embeds: [LinkVar], ephemeral: true})
    }
    if(!link.startsWith("https://") && !link.startsWith("http://") && link == "https://seasoned-gilded-jaborosa.glitch.me/") {
    const BaşıHatalı = new EmbedBuilder()
      .setColor(Colors.Red)
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`${Emojis.Çarpı} Eklemek istediğin linkin \`https://\` ile başladığından emin ol.`)
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    return await interaction.followUp({embeds: [BaşıHatalı], ephemeral: true})
    }
    if(!link.endsWith(".glitch.me") && !link.endsWith(".glitch.me/") && !link.endsWith(".repl.co") && !link.endsWith(".repl.co/") && link == "https://seasoned-gilded-jaborosa.glitch.me/") {
    const SonuHatalı = new EmbedBuilder()
      .setColor(Colors.Red)
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`${Emojis.Çarpı} Sistemimiz sadece glitch desteklemektedir, linkin sonunda \`.glitch.me\` - \`.glitch.me/\` olduğundan emin ol.`)
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    return await interaction.followUp({embeds: [SonuHatalı], ephemeral: true})
    }
     
    let PreVarmı
    if(!PremiumÜye) {
      PreVarmı = `${Emojis.Kırmızı}`
    } else {
      PreVarmı = `${Emojis.Yeşil}`
    }
      
    db.push(`UptimeLink_${interaction.user.id}`, link)
    db.push(`UptimeLink`, link)
      
    const UptimeLog = new EmbedBuilder()
      .setColor(Colors.Green)
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`> Sisteme bir link eklendi.`)
      .addFields(
        {
          name: `${Emojis.Kullanıcı} Kullanıcı bilgileri`, 
          value: `> ${interaction.user} \`${interaction.user.tag}\` \`(${interaction.user.id})\``
        },
        {
          name: `${Emojis.Link} Kullanıcı link sayısı`, 
          value: `> ${db.fetch(`UptimeLink_${interaction.user.id}`).length || 0}`
        },
        {
          name: `${Emojis.Belge} Toplam link sayısı`, 
          value: `> ${db.fetch(`UptimeLink`).length || 0}`
        },
        {
          name: `${Emojis.Elmas} Premiumu bulunuyormu`, 
          value: `> ${PreVarmı}`
        })
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    client.channels.cache.get(Logs.Uptime).send({embeds: [UptimeLog]})

    const Eklendi = new EmbedBuilder()
      .setColor(Colors.Green)
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`${Emojis.Tik} Belirtilen link sisteme eklendi, proje 2 ile 5 dakika arasında aktif olacaktır.`)
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    return await interaction.followUp({embeds: [Eklendi], ephemeral: true})
    })
  }
})
//=====// Link ekle \\=====\\

//=====// Link sil \\=====\\
client.on('interactionCreate', async interaction => {
if(!interaction.isButton()) return
if(interaction.customId === "sil") {
  const LinkSilmeFormu = new ModalBuilder()
  .setCustomId('linksilmeform2')
  .setTitle('Link sil')
const LinkSilFormu = new TextInputBuilder()
  .setCustomId('linksil')
  .setLabel('Proje adresinizi giriniz')
  .setStyle(TextInputStyle.Paragraph)
  .setMinLength(20)
  .setMaxLength(100)
  .setPlaceholder('https://proje-linki.glitch.me')
  .setRequired(true)
const LinkSilmeSistemi = new ActionRowBuilder().addComponents(LinkSilFormu);
LinkSilmeFormu.addComponents(LinkSilmeSistemi);
      
const PremiumÜye = db.fetch(`PremiumÜye_${interaction.guild.id}`)
await interaction.showModal(LinkSilmeFormu);
await interaction.awaitModalSubmit({ filter: (interaction) => interaction.customId === `linksilmeform2`, time: 60 * 60 * 1000 }).then(async (interaction) => {
await interaction.deferUpdate()
const Linkler = db.get(`UptimeLink_${interaction.user.id}`)
let link = interaction.fields.getTextInputValue("linksil")
const LinkYok = new EmbedBuilder()
  .setColor(Colors.Red)
  .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
  .setDescription(`${Emojis.Çarpı} Silmeye çalıştığın link sistemde bulunmuyor.`)
  .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
  .setTimestamp()
if(!Linkler.includes(link)) return await interaction.followUp({embeds: [LinkYok], ephemeral: true})

  let PreVarmı
    if(!PremiumÜye) {
      PreVarmı = `${Emojis.Kırmızı}`
    } else {
      PreVarmı = `${Emojis.Yeşil}`
    }
      
   db.unpush(`UptimeLink_${interaction.user.id}`, link)
   db.unpush(`UptimeLink`, link)
  
    const UptimeLog = new EmbedBuilder()
      .setColor(Colors.Red)
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`> Sistemden bir link silindi.`)
      .addFields(
        {
          name: `${Emojis.Kullanıcı} Kullanıcı bilgileri`, 
          value: `> ${interaction.user} \`${interaction.user.tag}\` \`(${interaction.user.id})\``
        },
        {
          name: `${Emojis.Link} Kullanıcı link sayısı`, 
          value: `> ${db.fetch(`UptimeLink_${interaction.user.id}`).length || 0}`
        },
        {
          name: `${Emojis.Belge} Toplam link sayısı`, 
          value: `> ${db.fetch(`UptimeLink`).length || 0}`
        },
        {
          name: `${Emojis.Elmas} Premiumu bulunuyormu`, 
          value: `> ${PreVarmı}`
        })
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    client.channels.cache.get(Logs.Uptime).send({embeds: [UptimeLog]})

  const Silindi = new EmbedBuilder()
    .setColor(Colors.Green)
    .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
    .setDescription(`${Emojis.Tik} Belirtilen link sistemden silindi.`)
    .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
    .setTimestamp()
  return await interaction.followUp({embeds: [Silindi], ephemeral: true})
    })
  }
})
//=====// Link sil \\=====\\

//=====// Link liste \\=====\\
client.on('interactionCreate', async interaction => {
if(!interaction.isButton()) return
if(interaction.customId === "liste") {
await interaction.deferUpdate()
const Linkler = db.get(`UptimeLink_${interaction.user.id}`)
    let LinkListe
    if(!Linkler) {
      LinkListe = `${Emojis.Çarpı} Sisteme hiç link eklememişsin.`
    } else {
      LinkListe = `${db.fetch(`UptimeLink_${interaction.user.id}`).map(l => `${Emojis.Sağ} \`${l}\``).join("\n") || `${Emojis.Çarpı} Sisteme hiç link eklememişsin.`}`
    }
    let Uptimeler
    if(!Linkler) {
      Uptimeler = 0
    } else {
      Uptimeler = `${db.fetch(`UptimeLink_${interaction.user.id}`).length || 0}`
    }
    const Liste = new EmbedBuilder()
      .setColor(Colors.Yellow)
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .addFields(
        {
          name: `${Emojis.Link} Linklerin (${Uptimeler})`,
          value: `${LinkListe}`
        })
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    return await interaction.followUp({embeds: [Liste], ephemeral: true})
  }
})
//=====// Link liste \\=====\\

//=====// Link düzenle \\=====\\
client.on('interactionCreate', async interaction => {
if(!interaction.isButton()) return
if(interaction.customId === "düzenle") {
  const DüzenlemeFormu = new ModalBuilder()
  .setCustomId('düzenlemeform2')
  .setTitle('Link düzenle')
const EskiLink = new TextInputBuilder()
  .setCustomId('eskilink')
  .setLabel('Eski proje adresinizi giriniz')
  .setStyle(TextInputStyle.Paragraph)
  .setMinLength(20)
  .setMaxLength(100)
  .setPlaceholder('https://proje-linki.glitch.me')
  .setRequired(true)
const EskiSistem = new ActionRowBuilder().addComponents(EskiLink)
DüzenlemeFormu.addComponents(EskiSistem) 

const YeniLink = new TextInputBuilder()
  .setCustomId('yenilink')
  .setLabel('Yeni proje adresinizi giriniz')
  .setStyle(TextInputStyle.Paragraph)
  .setMinLength(20)
  .setMaxLength(100)
  .setPlaceholder('https://proje-linki.glitch.me')
  .setRequired(true)
const YeniSistem = new ActionRowBuilder().addComponents(YeniLink)
DüzenlemeFormu.addComponents(YeniSistem)

  await interaction.showModal(DüzenlemeFormu)
  await interaction.awaitModalSubmit({ filter: (interaction) => interaction.customId === `düzenlemeform2`, time: 60 * 60 * 1000 }).then(async (interaction) => {
  const LinkLimit = db.fetch(`LinkLimit_${interaction.user.id}`) || 0
  let Limit = LinkLimit+3
  await interaction.deferUpdate()
  const link = interaction.fields.getTextInputValue("yenilink")
  const eskilink = interaction.fields.getTextInputValue("eskilink")
  let Linkler = db.fetch(`UptimeLink_${interaction.user.id}`, []) || []
  const PremiumÜye = db.fetch(`PremiumÜye_${interaction.user.id}`)

  if(Linkler.includes(link)) {
  const LinkVar = new EmbedBuilder()
    .setColor(Colors.Red)
    .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
    .setDescription(`${Emojis.Çarpı} Düzenlerken eklemeye çalıştığın link zaten sistemde bulunuyor.`)
    .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
    .setTimestamp()
  return await interaction.followUp({embeds: [LinkVar], ephemeral: true})
  }
    
  if(!Linkler.includes(eskilink)) {
  const LinkYok = new EmbedBuilder()
    .setColor(Colors.Red)
    .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
    .setDescription(`${Emojis.Çarpı} Düzenlerken silmeye çalıştığın link zaten sistemde bulunmuyor.`)
    .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
    .setTimestamp()
  return await interaction.followUp({embeds: [LinkYok], ephemeral: true})
  }
   
  if(!link.startsWith("https://") && !link.startsWith("http://")) {
    const BaşıHatalı = new EmbedBuilder()
      .setColor(Colors.Red)
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`${Emojis.Çarpı} Düzenlerken eklemek istediğin linkin \`https://\` ile başladığından emin ol.`)
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    return await interaction.followUp({embeds: [BaşıHatalı], ephemeral: true})
    }
    if(!link.endsWith(".glitch.me") && !link.endsWith(".glitch.me/") && !link.endsWith(".repl.co") && !link.endsWith(".repl.co/")) {
    const SonuHatalı = new EmbedBuilder()
      .setColor(Colors.Red)
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`${Emojis.Çarpı} Sistemimiz sadece glitch desteklemektedir, linkin sonunda \`.glitch.me\` - \`.glitch.me/\` olduğundan emin ol.`)
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    return await interaction.followUp({embeds: [SonuHatalı], ephemeral: true})
    }
    
    db.push(`UptimeLink_${interaction.user.id}`, link)
    db.push(`UptimeLink`, link)
      
    db.unpush(`UptimeLink_${interaction.user.id}`, eskilink)
    db.unpush(`UptimeLink`, eskilink)
      
    let PreVarmı
    if(!PremiumÜye) {
      PreVarmı = `${Emojis.Kırmızı}`
    } else {
      PreVarmı = `${Emojis.Yeşil}`
    }
    
    const UptimeLog = new EmbedBuilder()
      .setColor(Colors.Yellow)
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`> Sistemdeki bir link düzenlendi.`)
      .addFields(
        {
          name: `${Emojis.Kullanıcı} Kullanıcı bilgileri`, 
          value: `> ${interaction.user} \`${interaction.user.tag}\` \`(${interaction.user.id})\``
        },
        {
          name: `${Emojis.Link} Kullanıcı link sayısı`, 
          value: `> ${db.fetch(`UptimeLink_${interaction.user.id}`).length || 0}`
        },
        {
          name: `${Emojis.Belge} Toplam link sayısı`, 
          value: `> ${db.fetch(`UptimeLink`).length || 0}`
        },
        {
          name: `${Emojis.Elmas} Premiumu bulunuyormu`, 
          value: `> ${PreVarmı}`
        })
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    client.channels.cache.get(Logs.Uptime).send({embeds: [UptimeLog]})

    const Düzenlendi = new EmbedBuilder()
      .setColor(Colors.Green)
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`${Emojis.Tik} Belirtilen linkler düzenlendi.`)
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    return await interaction.followUp({embeds: [Düzenlendi], ephemeral: true})
    })
  }
})
//=====// Link düzenle \\=====\\