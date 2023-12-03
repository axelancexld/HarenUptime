const { Discord, EmbedBuilder, ChannelType, ButtonBuilder, ActionRowBuilder, ButtonStyle, ModalBuilder, TextInputStyle, TextInputBuilder, InteractionType, PermissionsBitField } = require ("discord.js")
const Emojis = require("../haren/emojis.json")
const Colors = require("../haren/colors.json")
const db = require("croxydb")

module.exports = {
  slash: true, 
  enable: true, 
  dbl: false, 
  name: ['duyuru'],  
  description: 'HarenUptime duyuru sistemi.',
  options: [
    { 
      name: "ekle",
      description: "Sisteme duyuru eklersiniz.", 
      type: 1,
      options: [
        { 
          name: "eklenecek-duyuru",
          description: "Sisteme eklenecek duyuru.", 
          type: 3,
          required: true
        }
      ]
    },
    { 
      name: "kaldır",
      description: "Sistemden duyuru kaldırırsınız.", 
      type: 1,
      options: [
        { 
          name: "kaldırılacak-duyuru",
          description: "Sisteme eklenecek duyuru.", 
          type: 3,
          required: true
        }
      ]
    }
  ],
    
async execute(client, interaction) {
  
  await interaction.deferReply()
  const Duyurular = db.fetch(`Duyurular`, []) || []
  
  const Sahip = new EmbedBuilder()
    .setColor(Colors.Red)
    .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
    .setDescription(`${Emojis.Çarpı} Bu komutu sadece geliştiriciler kullanabilir.`)
    .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
    .setTimestamp()
  if(interaction.user.id !== "367982908037791746" && interaction.user.id !== "367982908037791746" && interaction.user.id !== "367982908037791746" && interaction.user.id !== "361508226300248065") return await interaction.followUp({embeds: [Sahip]})

  if(interaction.options.getSubcommand() === 'ekle') {
   
  const duyuru = interaction.options.getString('eklenecek-duyuru')
  
  const DuyuruVar = new EmbedBuilder()
    .setColor(Colors.Red)
    .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
    .setDescription(`${Emojis.Çarpı} Bu duyuru zaten sistemde bulunuyor.`)
    .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
    .setTimestamp()
  if(Duyurular.includes(duyuru)) return await interaction.followUp({embeds: [DuyuruVar]})
     
  db.push(`Duyurular`, duyuru)
  const DuyuruEklendi = new EmbedBuilder()
    .setColor(Colors.Green)
    .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
    .setDescription(`${Emojis.Tik} \`${duyuru}\` duyurusu sisteme eklendi.`)
    .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
    .setTimestamp()
  await interaction.followUp({embeds: [DuyuruEklendi]})
  }
  
  if(interaction.options.getSubcommand() === 'kaldır') {
  
  const duyuru = interaction.options.getString('kaldırılacak-duyuru')
  
  const DuyuruYok = new EmbedBuilder()
    .setColor(Colors.Red)
    .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
    .setDescription(`${Emojis.Çarpı} Bu duyuru sistemde bulunmuyor.`)
    .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
    .setTimestamp()
  if(!Duyurular.includes(duyuru)) return await interaction.followUp({embeds: [DuyuruYok]})
     
  db.unpush(`Duyurular`, duyuru)
  const DuyuruKaldırıldı = new EmbedBuilder()
    .setColor(Colors.Green)
    .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
    .setDescription(`${Emojis.Tik} \`${duyuru}\` duyurusu sistemden kaldırıldı.`)
    .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
    .setTimestamp()
  await interaction.followUp({embeds: [DuyuruKaldırıldı]})
  }
  
  }
}