const { Discord, EmbedBuilder, ChannelType, ButtonBuilder, ActionRowBuilder, ButtonStyle, ModalBuilder, TextInputStyle, TextInputBuilder, InteractionType, PermissionsBitField } = require ("discord.js")
const Emojis = require("../haren/emojis.json")
const Colors = require("../haren/colors.json")
const Logs = require("../haren/logs.json")
const db = require("croxydb")

module.exports = {
  slash: true, 
  enable: true, 
  dbl: false, 
  name: ['link'],  
  description: 'HarenUptime.',
  options: [
    { 
      name: "ekle",
      description: "Sisteme link eklersiniz.", 
      type: 1
    },
    { 
      name: "sil",
      description: "Sistemden bir link silersiniz.", 
      type: 1
    },
    {
      name: "düzenle",
      description: "Sistemdeki linkinizi düzenlersiniz.", 
      type: 1
    },
    { 
      name: "liste",
      description: "Linklerinizi görüntülersiniz.", 
      type: 1
    },
    { 
      name: "say",
      description: "Sistemdeki link sayılarını gösterir.", 
      type: 1
    },
    { 
      name: "admin-sil",
      description: "Sistemden link silersiniz.", 
      type: 1
    },
    { 
      name: "admin-liste",
      description: "Sistemdeki birinin linklerini gösterir", 
      type: 1,
      options: [
        { 
          name: "kullanıcı", 
          description: "Linklerine bakılacak kullanıcı.", 
          type: 6,
          required: true
        }
      ],
    }
  ],
    
async execute(client, interaction) {
  
if(interaction.options.getSubcommand() === 'ekle') {
    
const LinkEklemeFormu = new ModalBuilder()
  .setCustomId('linkeklemeform')
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
    await interaction.awaitModalSubmit({ filter: (interaction) => interaction.customId === `linkeklemeform`, time: 60 * 60 * 1000 }).then(async (interaction) => {
    const LinkLimit = db.fetch(`LinkLimit_${interaction.user.id}`) || 0
    let Limit = LinkLimit+3
    await interaction.deferReply()
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
    return await interaction.followUp({embeds: [FazlaLink]})
    }
    } else {
    if(db.fetch(`UptimeLink_${interaction.user.id}`, []).length >= Limit) {
    const PreYok = new EmbedBuilder()
      .setColor(Colors.Red)
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`${Emojis.Çarpı} Premium üyeliğin bulunmadığı için en fazla ${Limit} link ekleyebilirsin.`)
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    return interaction.reply({embeds: [PreYok]})
      }
    }
    if(Linkler.includes(link)) {
    const LinkVar = new EmbedBuilder()
      .setColor(Colors.Red)
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`${Emojis.Çarpı} Belirtilen link zaten sistemde bulunuyor.`)
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    return await interaction.followUp({embeds: [LinkVar]})
    }
    if(!link.startsWith("https://") && !link.startsWith("http://")) {
    const BaşıHatalı = new EmbedBuilder()
      .setColor(Colors.Red)
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`${Emojis.Çarpı} Eklemek istediğin linkin \`https://\` - \`http://\` ile başladığından emin ol.`)
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    return await interaction.followUp({embeds: [BaşıHatalı]})
    }
    if(!link.endsWith(".glitch.me") && !link.endsWith(".glitch.me/") && !link.endsWith(".repl.co/") && !link.endsWith(".repl.co") && link == "https://seasoned-gilded-jaborosa.glitch.me/") {
    const SonuHatalı = new EmbedBuilder()
      .setColor(Colors.Red)
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`${Emojis.Çarpı} Sistemimiz sadece glitch ve replit desteklemektedir, linkin sonunda \`.glitch.me\` - \`.glitch.me/\` - \`.repl.co\` - \`.repl.co/\` olduğundan emin ol.`)
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    return await interaction.followUp({embeds: [SonuHatalı]})
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
    return await interaction.followUp({embeds: [Eklendi]})
    
    })  
  }
  
  
if(interaction.options.getSubcommand() === 'sil') {
    
const LinkSilmeFormu = new ModalBuilder()
  .setCustomId('linksilmeform')
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
      
await interaction.showModal(LinkSilmeFormu);
await interaction.awaitModalSubmit({ filter: (interaction) => interaction.customId === `linksilmeform`, time: 60 * 60 * 1000 }).then(async (interaction) => {
await interaction.deferReply()
const Linkler = db.get(`UptimeLink_${interaction.user.id}`)
let link = interaction.fields.getTextInputValue("linksil")
const LinkYok = new EmbedBuilder()
  .setColor(Colors.Red)
  .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
  .setDescription(`${Emojis.Çarpı} Silmeye çalıştığın link sistemde bulunmuyor.`)
  .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
  .setTimestamp()
if(!Linkler.includes(link)) return await interaction.followUp({embeds: [LinkYok]})
const PremiumÜye = db.fetch(`PremiumÜye_${interaction.user.id}`)

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
  return await interaction.followUp({embeds: [Silindi]})
    
    })    
  }
  
  
  if(interaction.options.getSubcommand() === 'düzenle') {
    
const DüzenlemeFormu = new ModalBuilder()
  .setCustomId('düzenlemeform')
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
  await interaction.awaitModalSubmit({ filter: (interaction) => interaction.customId === `düzenlemeform`, time: 60 * 60 * 1000 }).then(async (interaction) => {
  const LinkLimit = db.fetch(`LinkLimit_${interaction.user.id}`) || 0
  let Limit = LinkLimit+3
  await interaction.deferReply()
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
  return await interaction.followUp({embeds: [LinkVar]})
  }
    
  if(!Linkler.includes(eskilink)) {
  const LinkYok = new EmbedBuilder()
    .setColor(Colors.Red)
    .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
    .setDescription(`${Emojis.Çarpı} Düzenlerken silmeye çalıştığın link zaten sistemde bulunmuyor.`)
    .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
    .setTimestamp()
  return await interaction.followUp({embeds: [LinkYok]})
  }
   
  if(!link.startsWith("https://") && !link.startsWith("http://")) {
    const BaşıHatalı = new EmbedBuilder()
      .setColor(Colors.Red)
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`${Emojis.Çarpı} Düzenlerken eklemek istediğin linkin \`https://\` - \`http://\` ile başladığından emin ol.`)
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    return await interaction.followUp({embeds: [BaşıHatalı]})
    }
    if(!link.endsWith(".glitch.me") && !link.endsWith(".glitch.me/") && !link.endsWith(".repl.co/") && !link.endsWith(".repl.co")) {
    const SonuHatalı = new EmbedBuilder()
      .setColor(Colors.Red)
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`${Emojis.Çarpı} Sistemimiz sadece glitch ve replit desteklemektedir, linkin sonunda \`.glitch.me\` - \`.glitch.me/\` \`.repl.co\` - \`.repl.co/\` olduğundan emin ol.`)
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    return await interaction.followUp({embeds: [SonuHatalı]})
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
    return await interaction.followUp({embeds: [Düzenlendi]})
    
    })
  }
  
  
  if(interaction.options.getSubcommand() === 'liste') {
    
    const Linkler = db.get(`UptimeLink_${interaction.user.id}`)
    let LinkListe
    if(!Linkler) {
      LinkListe = `${Emojis.Çarpı} Sisteme hiç link eklememişsin.`
    } else {
      LinkListe = `${db.fetch(`UptimeLink_${interaction.user.id}`).map(l => `${Emojis.Sağ} ${l}`).join("\n") || `${Emojis.Çarpı} Sisteme hiç link eklememişsin.`}`
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
      .setDescription(`> ${Emojis.Ünlem} Sistemden link silerken eklediğiniz linkin sonuna / koyduysanız bunu ekleyerek, koymadıysanız eklemeden siliniz.`)
      .addFields(
        {
          name: `${Emojis.Link} Linklerin (${Uptimeler})`,
          value: `${LinkListe}`
        })
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    return await interaction.reply({embeds: [Liste], ephemeral: true})
    
  }
 
  
  if(interaction.options.getSubcommand() === 'admin-liste') {
    
    const Sahip = new EmbedBuilder()
      .setColor(Colors.Red)
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`${Emojis.Çarpı} Bu komutu sadece geliştiriciler kullanabilir.`)
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    if(interaction.user.id !== "367982908037791746" && interaction.user.id !== "367982908037791746" && interaction.user.id !== "878274777054318602" && interaction.user.id !== "361508226300248065") return await interaction.reply({embeds: [Sahip]})

    const kullanıcı = interaction.options.getUser('kullanıcı') 
    const Linkler = db.get(`UptimeLink_${kullanıcı.id}`)
    let LinkListe
    if(!Linkler) {
      LinkListe = `${Emojis.Çarpı} Sisteme hiç link eklememiş.`
    } else {
      LinkListe = `${db.fetch(`UptimeLink_${kullanıcı.id}`).map(l => `${Emojis.Sağ} ${l}`).join("\n") || `${Emojis.Çarpı} Sisteme hiç link eklememiş.`}`
    }
    let Uptimeler
    if(!Linkler) {
      Uptimeler = 0
    } else {
      Uptimeler = `${db.fetch(`UptimeLink_${kullanıcı.id}`).length || 0}`
    }
    const Liste = new EmbedBuilder()
      .setColor(Colors.Yellow)
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`> ${kullanıcı} adlı kullanıcının linkleri.`)
      .addFields(
        {
          name: `${Emojis.Link} Linkleri (${Uptimeler})`,
          value: `${LinkListe}`
        })
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    return await interaction.reply({embeds: [Liste], ephemeral: true})
    
  }
 
  
  
  if(interaction.options.getSubcommand() === 'say') {
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
    
    const Say = new EmbedBuilder()
      .setColor(Colors.Yellow)
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .addFields(
        {
          name: `${Emojis.Belge} Toplam link sayısı`,
          value: `> ${TümUptimeler}`
        },
        {
          name: `${Emojis.Link} Senin linklerinin sayısı`,
          value: `> ${Uptimeler}`
        },
        {
          name: `${Emojis.Sınır} Link ekleme hakkın`,
          value: `> ${Limit}`
        },
        {
          name: `${Emojis.Elmas} Toplam premium üyeler`,
          value: `> ${db.fetch(`PremiumSayı`) || 0}`
        })
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    await interaction.followUp({embeds: [Say]})
  
  }
  
  
  if(interaction.options.getSubcommand() === 'admin-sil') {
    
const SilmeFormu = new ModalBuilder()
  .setCustomId('silmeform')
  .setTitle('Admin link sil')
const SilFormu = new TextInputBuilder()
  .setCustomId('sil')
  .setLabel('Proje adresinizi giriniz')
  .setStyle(TextInputStyle.Paragraph)
  .setMinLength(20)
  .setMaxLength(100)
  .setPlaceholder('https://proje-linki.glitch.me')
  .setRequired(true)
const SilmeSistemi = new ActionRowBuilder().addComponents(SilFormu)
SilmeFormu.addComponents(SilmeSistemi) 

const SilID = new TextInputBuilder()
  .setCustomId('silid')
  .setLabel('Projesi silinecek kullanıcı idsini giriniz')
  .setStyle(TextInputStyle.Paragraph)
  .setPlaceholder('873182701061021696')
  .setRequired(true)
const SilmeID = new ActionRowBuilder().addComponents(SilID)
SilmeFormu.addComponents(SilmeID)

const Sebep = new TextInputBuilder()
  .setCustomId('sebep')
  .setLabel('Projeyi silme sebebini belirtin')
  .setStyle(TextInputStyle.Paragraph)
  .setPlaceholder('Geçersiz link.')
  .setRequired(true)
const SilmeSebep = new ActionRowBuilder().addComponents(Sebep)
SilmeFormu.addComponents(SilmeSebep)
  
await interaction.showModal(SilmeFormu)
await interaction.awaitModalSubmit({ filter: (interaction) => interaction.customId === `silmeform`, time: 60 * 60 * 1000 }).then(async (interaction) => {
await interaction.deferReply()
  
  const Sahip = new EmbedBuilder()
    .setColor(Colors.Red)
    .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
    .setDescription(`${Emojis.Çarpı} Bu komutu sadece geliştiriciler kullanabilir.`)
    .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
    .setTimestamp()
  if(interaction.user.id !== "361508226300248065" && interaction.user.id !== "878274777054318602" && interaction.user.id !== "367982908037791746" && interaction.user.id !== "361508226300248065") return await interaction.followUp({embeds: [Sahip]})

  let link = interaction.fields.getTextInputValue("sil")
  let sahip = interaction.fields.getTextInputValue("silid")
  let Sebep = interaction.fields.getTextInputValue("sebep")
  const Linkler = db.get(`UptimeLink_${sahip}`) || []

  const ProjeYok = new EmbedBuilder()
    .setColor(Colors.Red)
    .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
    .setDescription(`${Emojis.Çarpı} Bu kullanıcının böyle bir linki bulunmuyor.`)
    .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
    .setTimestamp()
  if(!Linkler.includes(link)) return await interaction.followUp({embeds: [ProjeYok]})
    db.unpush(`UptimeLink_${sahip}`, link)
    db.unpush(`UptimeLink`, link)
  
  const PremiumÜye = db.fetch(`PremiumÜye_${sahip}`)
  let PreVarmı
  if(!PremiumÜye) {
    PreVarmı = `${Emojis.Kırmızı}`
  } else {
    PreVarmı = `${Emojis.Yeşil}`
  }
  
  const UptimeLog = new EmbedBuilder()
      .setColor(Colors.Red)
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`> Bir admin tarafından sistemden bir link silindi.`)
      .addFields(
        {
          name: `${Emojis.Kullanıcı} Kullanıcı bilgileri`, 
          value: `> <@${sahip}> \`(${sahip})\``
        },
        {
          name: `${Emojis.Yetkili} Admin bilgileri`, 
          value: `> ${interaction.user} \`${interaction.user.tag}\` \`(${interaction.user.id})\``
        },
        {
          name: `${Emojis.Link} Kullanıcı link sayısı`, 
          value: `> ${db.fetch(`UptimeLink_${sahip}`).length || 0}`
        },
        {
          name: `${Emojis.Belge} Toplam link sayısı`, 
          value: `> ${db.fetch(`UptimeLink`).length || 0}`
        },
        {
          name: `${Emojis.Elmas} Premiumu bulunuyormu`, 
          value: `> ${PreVarmı}`
        },
        {
          name: `${Emojis.Soru} Link silinme sebebi`, 
          value: `> ${Sebep}`
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
  await interaction.followUp({embeds: [Silindi]})
      
  
    }) 
  }

  
  }
}