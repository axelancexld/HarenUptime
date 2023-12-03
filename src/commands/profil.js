const { Discord, EmbedBuilder, ChannelType, ButtonBuilder, ActionRowBuilder, ButtonStyle, ModalBuilder, TextInputStyle, TextInputBuilder, InteractionType, PermissionsBitField } = require ("discord.js")
const Emojis = require("../haren/emojis.json")
const Colors = require("../haren/colors.json")
const db = require("croxydb")

module.exports = {
  slash: true, 
  enable: true, 
  dbl: false, 
  name: ['profil'],  
  description: 'Profilinize bakarsınız.',
  options: [
    { 
      name: "kullanıcı", 
      description: "Profiline bakılacak kullanıcı.", 
      type: 6,
      required: false
    }
  ],
  
async execute(client, interaction) {
  
  await interaction.deferReply()
  
  const kullanıcı = interaction.options.getUser('kullanıcı') || interaction.user
  const Rozetler = db.fetch(`Rozetler_${kullanıcı.id}`, [])
  const Linkler = db.fetch(`UptimeLink`)
  const Uptime = db.fetch(`UptimeLink_${kullanıcı.id}`)
  const LinkLimit = db.fetch(`LinkLimit_${kullanıcı.id}`) || 0
  let Limit = LinkLimit+3
  let Uptimeler
  if(!Uptime) {
    Uptimeler = 0
  } else {
    Uptimeler = `${db.fetch(`UptimeLink_${kullanıcı.id}`).length || 0}`
  }
  let PremiumVarmı = db.fetch(`PremiumÜye_${kullanıcı.id}`)
  let PreVarmı
  if(!PremiumVarmı) {
    PreVarmı = `${Emojis.Kırmızı}`
  } else {
    PreVarmı = `${Emojis.Yeşil} | ${db.fetch(`SüreliPremium_${kullanıcı.id}`) || `Süresiz`}`
  }
  let Liste
  if(!Rozetler) {
    Liste = `${Emojis.RozetKullanıcı}`
  } else {
    Liste = `${Emojis.RozetKullanıcı} `+`${Rozetler.map((r) => ` ${r}`).join("  ") || `${Emojis.RozetKullanıcı}`}`
  }
  
  const Profil = new EmbedBuilder()
    .setColor(Colors.Yellow)
    .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
    .addFields(
      {
        name: `${Emojis.Kullanıcı} Kullanıcı bilgileri`,
        value: `> ${kullanıcı} \`${kullanıcı.tag}\` \`(${kullanıcı.id})\``
      }, 
      {
        name: `${Emojis.Belge} Sistemdeki link sayısı`, 
        value: `> ${Uptimeler}`
      },
      {
        name: `${Emojis.Sınır} Link ekleme hakkı`,
        value: `> ${Limit}`
      },
      {
        name: `${Emojis.Elmas} Premium üyeliği varmı`,
        value: `> ${PreVarmı}`
      },
      {
        name: `${Emojis.Yıldız} Rozetleri`,
        value: `> ${Liste}`
      })
    .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
    .setTimestamp()
  await interaction.followUp({embeds: [Profil]})
  
  }
}