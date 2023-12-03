const { Discord, EmbedBuilder, ChannelType, ButtonBuilder, ActionRowBuilder, ButtonStyle, ModalBuilder, TextInputStyle, TextInputBuilder, InteractionType, PermissionsBitField } = require ("discord.js")
const Emojis = require("../haren/emojis.json")
const Colors = require("../haren/colors.json")
const Logs = require("../haren/logs.json")
const db = require("croxydb")
const { botid } = require("../base/settings.json")

module.exports = {
  slash: true, 
  enable: true, 
  dbl: false, 
  name: ['automod'],  
  description: 'AutoMod sistemi.',
  options: [
    { 
      name: "flagged-words",
      description: "Flagged words AutoMod'unu açar", 
      type: 1
    },
    { 
      name: "spam-messages",
      description: "Spam messages AutoMod'unu açar", 
      type: 1
    },
    { 
      name: "mention-spam",
      description: "Mention spam AutoMod'unu açar", 
      type: 1
    },
    { 
      name: "keyword",
      description: "Keyword AutoMod'unu açar", 
      type: 1,
      options: [
        { 
          name: "kelime",
          description: "AutoMod'a eklenecek kelime.", 
          type: 3,
          required: true
        },
      ],
    },
  ],

async execute(client, interaction) { 
  
  await interaction.deferReply()
  if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.editReply({content: `AutoMod açmak için **Yönetici** yetkisine sahip olmalısın.`})

  const { guild, options } = interaction
  const Seçenek = options.getSubcommand()
  
  switch(Seçenek) {
    case "spam-messages": {
      
      await interaction.editReply({content: `AutoMod kuralı kuruluyor.`})
      
      const Kural = await guild.autoModerationRules.create({
        name: 'Spam messages',
        creatorId: botid,
        enabled: true,
        eventType: 1,
        triggerType: 3,
        triggerMetadata: {
          mentionTotalLimit: 5
        },
        actions: [
          {
            type: 1,
            metadata: {
              channel: interaction.channel,
              durationSeconds: 10,
              customMessage: 'Your message was blocked by AutoMod.'
            }
          }
        ]
      }).catch(async hata => {
        setTimeout(async () => {
          await interaction.editReply({content: `AutoMod kuralı uygulanırken bir hata meydana geldi. Hata: \`${hata}\``})
        }, 2000)
      })
      setTimeout(async () => {
        if(!Kural) return 
        await interaction.editReply({content: `AutoMod kuralı başarılı şekilde oluşturuldu.`})
      }, 3000)
    }
    break
    case "flagged-words": {
      
      await interaction.editReply({content: `AutoMod kuralı kuruluyor.`})
      
      const Kural2 = await guild.autoModerationRules.create({
        name: 'Flagged words',
        creatorId: botid,
        enabled: true,
        eventType: 1,
        triggerType: 4,
        triggerMetadata: {
          presets: [1, 2, 3]
        },
        actions: [
          {
            type: 1,
            metadata: {
              channel: interaction.channel,
              durationSeconds: 10,
              customMessage: 'Your message was blocked by AutoMod.'
            }
          }
        ]
      }).catch(async hata => {
        setTimeout(async () => {
          await interaction.editReply({content: `AutoMod kuralı uygulanırken bir hata meydana geldi. Hata: \`${hata}\``})
        }, 2000)
      })
      setTimeout(async () => {
        if(!Kural2) return 
        await interaction.editReply({content: `AutoMod kuralı başarılı şekilde oluşturuldu.`})
      }, 3000)
    }
    break
    case "mention-spam": {
      
      await interaction.editReply({content: `AutoMod kuralı kuruluyor.`})
      
      const Kural3 = await guild.autoModerationRules.create({
        name: 'Mention spam',
        creatorId: botid,
        enabled: true,
        eventType: 1,
        triggerType: 5,
        triggerMetadata: {
          mentionTotalLimit: 5
        },
        actions: [
          {
            type: 1,
            metadata: {
              channel: interaction.channel,
              durationSeconds: 10,
              customMessage: 'Your message was blocked by AutoMod.'
            }
          }
        ]
      }).catch(async hata => {
        setTimeout(async () => {
          await interaction.editReply({content: `AutoMod kuralı uygulanırken bir hata meydana geldi. Hata: \`${hata}\``})
        }, 2000)
      })
      setTimeout(async () => {
        if(!Kural3) return 
        await interaction.editReply({content: `AutoMod kuralı başarılı şekilde oluşturuldu.`})
      }, 3000)
    }
    break
    case "keyword": {
      
      await interaction.editReply({content: `AutoMod kuralı kuruluyor.`})
      const Kelime = interaction.options.getString('kelime')
  
      const Kural4 = await guild.autoModerationRules.create({
        name: 'Keyword',
        creatorId: botid,
        enabled: true,
        eventType: 1,
        triggerType: 1,
        triggerMetadata: {
          keywordFilter: [`${Kelime}`]
        },
        actions: [
          {
            type: 1,
            metadata: {
              channel: interaction.channel,
              durationSeconds: 10,
              customMessage: 'Your message was blocked by AutoMod.'
            }
          }
        ]
      }).catch(async hata => {
        setTimeout(async () => {
          await interaction.editReply({content: `AutoMod kuralı uygulanırken bir hata meydana geldi. Hata: \`${hata}\``})
        }, 2000)
      })
      setTimeout(async () => {
        if(!Kural4) return 
        await interaction.editReply({content: `AutoMod kuralı başarılı şekilde oluşturuldu.`})
      }, 3000)
    }
    break
  }
  
  }
}