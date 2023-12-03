const { Discord, EmbedBuilder, ChannelType, ButtonBuilder, ActionRowBuilder, ButtonStyle, ModalBuilder, TextInputStyle, TextInputBuilder, InteractionType, PermissionsBitField } = require ("discord.js")
const Emojis = require("../haren/emojis.json")
const Colors = require("../haren/colors.json")
const Logs = require("../haren/logs.json")
const db = require("croxydb")

module.exports = {
  slash: true, 
  enable: true, 
  dbl: false, 
  name: ['promosyon'],  
  description: 'HarenUptime promosyon sistemi.',
  options: [
    { 
      name: "oluştur",
      description: "Promosyon kodu oluşturursunuz.", 
      type: 1
    },
    { 
      name: "sil",
      description: "Promosyon kodunu silersiniz.", 
      type: 1
    },
    { 
      name: "kullan",
      description: "Promosyon kodu kullanırsınız.", 
      type: 1
    },
    { 
      name: "liste",
      description: "Promosyon kodlarını görüntülersiniz.", 
      type: 1
    }
  ],
    
async execute(client, interaction) {
  
  if(interaction.options.getSubcommand() === 'oluştur') {
   
  const KodOluşturmaFormu = new ModalBuilder()
    .setCustomId('kodoluşturmaform')
    .setTitle('Promosyon oluşturma')
  const KodOluşturFormu = new TextInputBuilder()
    .setCustomId('kod')
    .setLabel('Oluşturulacak kod.')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('Uptime')
    .setRequired(true)
  const KodOluşturmaSistemi = new ActionRowBuilder().addComponents(KodOluşturFormu)
    KodOluşturmaFormu.addComponents(KodOluşturmaSistemi)

  const KodKullanımHakkı = new TextInputBuilder()
    .setCustomId('kodkullanımhakkı')
    .setLabel('Kodun kullanım limitini giriniz')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('10')
    .setRequired(true)
  const KullanımHakkı = new ActionRowBuilder().addComponents(KodKullanımHakkı)
    KodOluşturmaFormu.addComponents(KullanımHakkı)

  const KodMiktarı = new TextInputBuilder()
    .setCustomId('kodmiktarı')
    .setLabel('Kodun vereceği link limit miktarı')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('5')
    .setRequired(true)
  const KodÖdülü = new ActionRowBuilder().addComponents(KodMiktarı)
    KodOluşturmaFormu.addComponents(KodÖdülü)
 
  await interaction.showModal(KodOluşturmaFormu)
  await interaction.awaitModalSubmit({filter: (interaction) => interaction.customId === `kodoluşturmaform`, time: 60 * 60 * 1000 }).then(async (interaction) => {
  if(!interaction.isModalSubmit()) return
    
  await interaction.deferReply()
  
  const Sahip = new EmbedBuilder()
    .setColor(Colors.Red)
    .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
    .setDescription(`${Emojis.Çarpı} Bu komutu sadece geliştiriciler kullanabilir.`)
    .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
    .setTimestamp()
  if(interaction.user.id !== "367982908037791746" && interaction.user.id !== "878274777054318602" && interaction.user.id !== "361508226300248065" && interaction.user.id !== "367982908037791746") return await interaction.followUp({embeds: [Sahip]})

  let kod = interaction.fields.getTextInputValue("kod")
  let kodödül = interaction.fields.getTextInputValue("kodmiktarı")
  let kodkullanım = interaction.fields.getTextInputValue("kodkullanımhakkı")
  const Kod = db.fetch(`Kod_${kod}`)
    
  if(!Kod) {
    db.set(`Kod_${kod}`, true)
    db.set(`KodÖdül_${kod}`, kodödül)
    db.add(`KodKullanım_${kod}`, kodkullanım)
    db.set(`ToplamKullanım_${kod}`, kodkullanım)
    db.push(`Kodlar`, kod)
    const Oluştu = new EmbedBuilder()
      .setColor(Colors.Green)
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`${Emojis.Tik} Promosyon kodu oluşturuldu.`)
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    await interaction.followUp({embeds: [Oluştu]})
    const PromoLog = new EmbedBuilder()
      .setColor(Colors.Green)
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`> Bir promosyon kodu oluşturuldu.`)
      .addFields(
        {
          name: `${Emojis.Yetkili} Oluşturan kişi`, 
          value: `> ${interaction.user} \`${interaction.user.tag}\` \`(${interaction.user.id})\``
        },
        {
          name: `${Emojis.Yıldız} Oluşturulan kod`, 
          value: `> ${kod}`
        },
        {
          name: `${Emojis.Sınır} Kullanım hakkı`, 
          value: `> ${kodkullanım}`
        },
        {
          name: `${Emojis.Hediye} Verilecek link limit hakkı`, 
          value: `> ${kodödül}`
        })
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    client.channels.cache.get(Logs.Promo).send({embeds: [PromoLog]})
  } else {
    const Var = new EmbedBuilder()
      .setColor(Colors.Red)
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`${Emojis.Çarpı} Bu promosyon kodu zaten sistemde bulunuyor.`)
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    await interaction.followUp({embeds: [Var]})
  }
    })
  }
  
  if(interaction.options.getSubcommand() === 'sil') {
   
  const KodSilmeFormu = new ModalBuilder()
    .setCustomId('kodsilmeform')
    .setTitle('Promosyon silme')
  const KodSilFormu = new TextInputBuilder()
    .setCustomId('kod')
    .setLabel('Silinecek promosyon kodu')
    .setStyle(TextInputStyle.Paragraph)
    .setPlaceholder('Uptime')
    .setRequired(true)
  const KodSilmeSistemi = new ActionRowBuilder().addComponents(KodSilFormu)
    KodSilmeFormu.addComponents(KodSilmeSistemi)
    
  await interaction.showModal(KodSilmeFormu)
  await interaction.awaitModalSubmit({filter: (interaction) => interaction.customId === `kodsilmeform`, time: 60 * 60 * 1000 }).then(async (interaction) => {
  if(!interaction.isModalSubmit()) return
    
  await interaction.deferReply()
  
  const Sahip = new EmbedBuilder()
    .setColor(Colors.Red)
    .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
    .setDescription(`${Emojis.Çarpı} Bu komutu sadece geliştiriciler kullanabilir.`)
    .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
    .setTimestamp()
  if(interaction.user.id !== "361508226300248065" && interaction.user.id !== "878274777054318602" && interaction.user.id !== "367982908037791746" && interaction.user.id !== "361508226300248065") return await interaction.followUp({embeds: [Sahip]})

  let kod = interaction.fields.getTextInputValue("kod")
  const Kod = db.fetch(`Kod_${kod}`)
  const KodÖdül = db.fetch(`KodÖdül_${kod}`)
  const KodKullanım = db.fetch(`KodKullanım_${kod}`)
      
  if(!Kod) {
    const Yok = new EmbedBuilder()
      .setColor(Colors.Red)
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`${Emojis.Çarpı} Bu promosyon kodu sistemde bulunmuyor.`)
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    await interaction.followUp({embeds: [Yok]})
  } else {
    db.delete(`Kod_${kod}`)
    db.delete(`KodÖdül_${kod}`)
    db.delete(`KodKullanım_${kod}`)
    db.delete(`ToplamKullanım_${kod}`)
    db.unpush(`Kodlar`, kod)
    const Silindi = new EmbedBuilder()
      .setColor(Colors.Green)
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`${Emojis.Tik} Promosyon kodu silindi.`)
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    await interaction.followUp({embeds: [Silindi]})
    const PromoLog = new EmbedBuilder()
      .setColor(Colors.Red)
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`> Bir promosyon kodu silindi.`)
      .addFields(
        {
          name: `${Emojis.Yetkili} Silen kişi`, 
          value: `> ${interaction.user} \`${interaction.user.tag}\` \`(${interaction.user.id})\``
        },
        {
          name: `${Emojis.Yıldız} Silinen kod`, 
          value: `> ${kod}`
        },
        {
          name: `${Emojis.Sınır} Kullanım hakkı`, 
          value: `> ${KodKullanım}`
        },
        {
          name: `${Emojis.Hediye} Verilecek link limit hakkı`, 
          value: `> ${KodÖdül}`
        })
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    client.channels.cache.get(Logs.Promo).send({embeds: [PromoLog]})
  }
    })
  }
  
  
  if(interaction.options.getSubcommand() === 'liste') {
    
  const Sahip = new EmbedBuilder()
    .setColor(Colors.Red)
    .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
    .setDescription(`${Emojis.Çarpı} Bu komutu sadece geliştiriciler kullanabilir.`)
    .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
    .setTimestamp()
  if(interaction.user.id !== "367982908037791746" && interaction.user.id !== "878274777054318602" && interaction.user.id !== "367982908037791746" && interaction.user.id !== "361508226300248065") return await interaction.followUp({embeds: [Sahip]})

  const Kodlar = db.fetch(`Kodlar`, [])
  let Liste
  if(!Kodlar) {
    Liste = `${Emojis.Çarpı} Promosyon kodu bulunmuyor.`
  } else {
    Liste = `${Kodlar.map((k) => `${Emojis.Sağ} Kod: \`${k}\` - Ödül: \`${db.fetch(`KodÖdül_${k}`) || 0}\` - Kullanım: \`${db.fetch(`KodKullanım_${k}`) || 0}\``).join("\n") || `${Emojis.Çarpı} Promosyon kodu bulunmuyor.`}`
  }
  
  const KodListe = new EmbedBuilder()
    .setColor(Colors.Yellow)
    .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
    .setDescription(`> HarenUptime promosyon kodları listesi`)
    .addFields(
      {
        name: `${Emojis.Yıldız} Promosyon kodları`,
        value: `${Liste}`
      })
    .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
    .setTimestamp()
  await interaction.reply({embeds: [KodListe], ephemeral: true})
  }
   
  
  if(interaction.options.getSubcommand() === 'kullan') {
   
    const KodKullanmaFormu = new ModalBuilder()
    .setCustomId('kodkullanmaform')
    .setTitle('Promosyon kullanma')
  const KodKullanFormu = new TextInputBuilder()
    .setCustomId('kod')
    .setLabel('Kullanılacak promosyon kodu')
    .setStyle(TextInputStyle.Paragraph)
    .setPlaceholder('Uptime')
    .setRequired(true)
  const KodKullanmaSistemi = new ActionRowBuilder().addComponents(KodKullanFormu)
    KodKullanmaFormu.addComponents(KodKullanmaSistemi)
    
    await interaction.showModal(KodKullanmaFormu)
  await interaction.awaitModalSubmit({filter: (interaction) => interaction.customId === `kodkullanmaform`, time: 60 * 60 * 1000 }).then(async (interaction) => {
  if(!interaction.isModalSubmit()) return
    
  await interaction.deferReply()
  
  let kod = interaction.fields.getTextInputValue("kod")
      
  const Kod = db.fetch(`Kod_${kod}`)
  const KodÖdül = db.fetch(`KodÖdül_${kod}`)
  const KodKullanım = db.fetch(`KodKullanım_${kod}`)
  const KodKullanıldı = db.fetch(`KodKullanıldı_${interaction.user.id}_${kod}`)
  const ToplamKullanım = db.fetch(`ToplamKullanım_${kod}`)
    
  if(!Kod) {
    const Yok = new EmbedBuilder()
      .setColor(Colors.Red)
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`${Emojis.Çarpı} Sistemde böyle bir promosyon kodu bulunmuyor.`)
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    await interaction.followUp({embeds: [Yok]})
  } else { 
      if(KodKullanım > 0) {
      if(!KodKullanıldı) {
        db.add(`LinkLimit_${interaction.user.id}`, KodÖdül)
        db.subtract(`KodKullanım_${kod}`, 1)
        db.set(`KodKullanıldı_${interaction.user.id}_${kod}`, true)
        const Kullandın = new EmbedBuilder()
          .setColor(Colors.Green)
          .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
          .setDescription(`${Emojis.Tik} Promosyon kodu kullanıldı ve ödül olarak ${KodÖdül} link ekleme hakkı eklendi. Toplam link ekleme hakkın: ${(db.fetch(`LinkLimit_${interaction.user.id}`) || 0)+3}`)
          .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
          .setTimestamp()
        await interaction.followUp({embeds: [Kullandın]})
      } else {
        const Kullanmışsın = new EmbedBuilder()
          .setColor(Colors.Red)
          .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
          .setDescription(`${Emojis.Çarpı} Bu promosyon kodunu sen zaten kullanmışsın.`)
          .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
          .setTimestamp()
        await interaction.followUp({embeds: [Kullanmışsın]})
      }
      } else {
        const Dolu = new EmbedBuilder()
          .setColor(Colors.Red)
          .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
          .setDescription(`${Emojis.Çarpı} Bu promosyon kodunun kullanım limiti dolmuş. Kullanım limiti: \`${ToplamKullanım}\``)
          .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
          .setTimestamp()
        await interaction.followUp({embeds: [Dolu]})
      }
    }
    })
  }
  
  }
}