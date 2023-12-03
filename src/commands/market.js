const { Discord, EmbedBuilder, ChannelType, ButtonBuilder, ActionRowBuilder, ButtonStyle, ModalBuilder, TextInputStyle, TextInputBuilder, InteractionType, PermissionsBitField, StringSelectMenuBuilder, SlashCommandBuilder, ContextMenuCommandBuilder, ApplicationCommandType } = require ("discord.js")
const db = require("croxydb")
const ms = require("ms")
const moment = require("moment")
const Emojis = require("../haren/emojis.json")
const Colors = require("../haren/colors.json")
const Logs = require("../haren/logs.json")

module.exports = {
  slash: true, 
  enable: true, 
  dbl: false, 
  name: ['market'],  
  description: 'HarenUptime marketini görüntülersiniz.',

async execute(client, interaction) { 
  
  const Butonlar = new ActionRowBuilder()
    .addComponents(new ButtonBuilder()
      .setEmoji(Emojis.Elmas)
      .setLabel("Premium")
      .setStyle(ButtonStyle.Secondary)
      .setCustomId(`premiumal_${interaction.user.id}`),
    new ButtonBuilder()
      .setEmoji(Emojis.Sınır)
      .setLabel("Link limit")
      .setStyle(ButtonStyle.Secondary)
      .setCustomId(`linklimital_${interaction.user.id}`),
    new ButtonBuilder()        
      .setURL(`https://discord.gg/XjBRvvaUzM`)
      .setLabel(`Destek sunucusu`)
      .setStyle("Link"))
 
  const Market = new EmbedBuilder()
    .setColor(Colors.Yellow)
    .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
    .setDescription(`> Satın almak istediğiniz ürünü mesaj altında bulunan menüden seçerek alabilirsiniz.`)
    .addFields(
      {
        name: `${Emojis.Sınır} Link limit`,
        value: `+1 link ekleme hakkı - **30 HC**`
      },
      {
        name: `${Emojis.Elmas} Premium üyelik`,
        value: `1 aylık premium üyeliği - **300 HC**`
      },
      {
        name: `${Emojis.Para} HarenCoin(HC)`,
        value: `HC almak için destek sunucusunda kurucu veya geliştiriciler ile iletişime geçiniz.`
      })
    .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
    .setTimestamp()
  await interaction.reply({embeds: [Market], components: [Butonlar]})
  
  client.on('interactionCreate', async interaction => {
    if(interaction.customId === `linklimital_${interaction.user.id}`) {
        const LimitFormu = new ModalBuilder()
          .setCustomId('limitalmaform')
          .setTitle('Link limit satın al')
        const LimitMiktarı = new TextInputBuilder()
          .setCustomId('limitmiktarı')
          .setLabel('Almak istediğin link limit hakkı.')
          .setStyle(TextInputStyle.Short)
          .setRequired(true)
        const LinkLimit = new ActionRowBuilder().addComponents(LimitMiktarı)
          LimitFormu.addComponents(LinkLimit)
        await interaction.showModal(LimitFormu)
        await interaction.awaitModalSubmit({ filter: (interaction) => interaction.customId === `limitalmaform`, time: 60000 }).then(async (interaction) => {
          await interaction.deferReply()
          const Limit = interaction.fields.getTextInputValue("limitmiktarı")
          const Bakiye = db.fetch(`Bakiye_${interaction.user.id}`)
          
          const ParaYok = new EmbedBuilder()
            .setColor(Colors.Red)
            .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
            .setDescription(`${Emojis.Çarpı} Almak istediğin **${Limit}** link limit hakkı için **${Limit*30} HC** gerekli.`)
            .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
            .setTimestamp()
          if(Limit*30 > Bakiye) return await interaction.followUp({embeds: [ParaYok]})
          
          db.subtract(`Bakiye_${interaction.user.id}`, Limit*30)
          db.add(`LinkLimit_${interaction.user.id}`, Limit)
          
          const Alındı = new EmbedBuilder()
            .setColor(Colors.Green)
            .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
            .setDescription(`${Emojis.Tik} **${Limit}** link limit hakkı **${Limit*30} HC** karşılığında satın alındı.`)
            .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
            .setTimestamp()
          await interaction.followUp({embeds: [Alındı]})
          
        })
      }
    })
    
    client.on('interactionCreate', async interaction => {
      if(interaction.customId === `premiumal_${interaction.user.id}`) {
        await interaction.deferReply()
        const Bakiye = db.fetch(`Bakiye_${interaction.user.id}`)
        const Premium = db.fetch(`PremiumÜye_${interaction.user.id}`)
        if(Premium) {
           const PreVar = new EmbedBuilder()
            .setColor(Colors.Red)
            .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
            .setDescription(`${Emojis.Çarpı} Zaten aktif olarak premium üyeliğin bulunuyor.`)
            .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
            .setTimestamp()
          await interaction.followUp({embeds: [PreVar]})
        } else {
          const ParaYok = new EmbedBuilder()
            .setColor(Colors.Red)
            .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
            .setDescription(`${Emojis.Çarpı} Premium almak için **300 HC** gerekli.`)
            .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
            .setTimestamp()
          if(Bakiye < 300) return await interaction.followUp({embeds: [ParaYok]})
          
          let PremiumBitiş = Date.now() + ms('24 gün'.replace('gün', 'day').replace('saat', 'hours').replace('hafta', 'week'))
          
          db.subtract(`Bakiye_${interaction.user.id}`, 300)
          db.set(`PremiumÜye_${interaction.user.id}`, true)
          db.add(`PremiumSayı`, 1)
          db.set(`SüreliPremium_${interaction.user.id}`, moment(PremiumBitiş).format('DD.MM.YYYY - HH:mm:ss')) 
          db.push(`Premiumlar`, interaction.user.id)
          db.push(`Rozetler_${interaction.user.id}`, Emojis.RozetPremium)
          
          const Alındı = new EmbedBuilder()
            .setColor(Colors.Green)
            .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
            .setDescription(`${Emojis.Tik} 1 aylık premium üyeliği satın alındı.`)
            .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
            .setTimestamp()
          await interaction.followUp({embeds: [Alındı]})
          
          const PremiumLog = new EmbedBuilder()
            .setColor(Colors.Green)
            .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
            .setDescription(`> Bir kullanıcı premium üyelik satın aldı.`)
            .addFields(
              {
                name: `${Emojis.Kullanıcı} Kullanıcı bilgileri`, 
                value: `> ${interaction.user} \`${interaction.user.tag}\` \`(${interaction.user.id})\``
              },
              {
                name: `${Emojis.Uptime} Premium bitiş zamanı`,
                value: `> ${moment(PremiumBitiş).format('DD.MM.YYYY - HH:mm:ss')}`
              })
            .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
            .setTimestamp()
          client.channels.cache.get(Logs.Premium).send({embeds: [PremiumLog]})
          
          setTimeout(() => {
            db.delete(`PremiumÜye_${interaction.user.id}`)
            db.delete(`SüreliPremium_${interaction.user.id}`)
            db.subtract(`PremiumSayı`, 1)
            db.unpush(`Premiumlar`, interaction.user.id)
            db.unpush(`Rozetler_${interaction.user.id}`, Emojis.RozetPremium)
            
            const PremiumLog = new EmbedBuilder()
              .setColor(Colors.Red)
              .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
              .setDescription(`> Bir kullanıcının premium üyeliğinin süresi sona erdi.`)
              .addFields(
                {
                  name: `${Emojis.Kullanıcı} Kullanıcı bilgileri`, 
                  value: `> ${interaction.user} \`${interaction.user.tag}\` \`(${interaction.user.id})\``
                })
              .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
              .setTimestamp()
            client.channels.cache.get(Logs.Premium).send({embeds: [PremiumLog]})
            
          }, ms('24 gün'.replace('gün', 'day').replace('saat', 'hours').replace('hafta', 'week')))
        }
      }
  })
 
  }
}