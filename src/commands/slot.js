const { Discord, EmbedBuilder, ChannelType, ButtonBuilder, ActionRowBuilder, ButtonStyle, ModalBuilder, TextInputStyle, TextInputBuilder, InteractionType, PermissionsBitField, StringSelectMenuBuilder, SlashCommandBuilder, ContextMenuCommandBuilder, ApplicationCommandType } = require ("discord.js")
const db = require("croxydb")
const Emojis = require("../haren/emojis.json")
const Colors = require("../haren/colors.json")
const Logs = require("../haren/logs.json")

module.exports = {
  slash: true, 
  enable: true, 
  dbl: false, 
  name: ['slot'],  
  description: 'Slot oynarsınız.',
  options: [
    { 
      name: "miktar",
      description: "Oynanacak slot miktarı.", 
      type: 10,
      required: true 
    },
  ],
  
async execute(client, interaction) { 
  
  await interaction.deferReply()
  
  const Miktar = interaction.options.getNumber('miktar') 
  const Bakiye = db.fetch(`Bakiye_${interaction.user.id}`) || 0
  
  const ParaYok = new EmbedBuilder()
    .setColor(Colors.Red)
    .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
    .setDescription(`${Emojis.Çarpı} Slot oynamak istediğin **${Miktar} HC** bakiyende bulunmuyor.`)
    .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
    .setTimestamp()
  if(Bakiye < Miktar) return await interaction.followUp({embeds: [ParaYok]})
  
  const Eşyalar = [Emojis.RozetBug, Emojis.RozetDestekçi, Emojis.RozetSponsor, Emojis.RozetPremium]
  var Şans1 = Eşyalar[Math.floor(Math.random() * Eşyalar.length)]
  var Şans2 = Eşyalar[Math.floor(Math.random() * Eşyalar.length)]
  var Şans3 = Eşyalar[Math.floor(Math.random() * Eşyalar.length)]
      
  if(Şans1 === Şans2 && Şans1 === Şans3) {
        
    db.add(`Bakiye_${interaction.user.id}`, Miktar*2)
    
    const Kazandın = new EmbedBuilder()
      .setColor(Colors.Green)
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`
> ${Emojis.Şans} Slot oyununu kazandın. | ${Şans1} | ${Şans2} | ${Şans3} |

> ${Emojis.Para} Kazanılan para: **${Miktar*3} HC**  -  Kazanç: **${Miktar*3-Miktar} HC**
`)
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    await interaction.followUp({embeds: [Kazandın]})
  
  } else {
    db.subtract(`Bakiye_${interaction.user.id}`, Miktar)
    
    const Kaybettin = new EmbedBuilder()
      .setColor(Colors.Red)
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`
> ${Emojis.Şans} Slot oyununu kaybettin. | ${Şans1} | ${Şans2} | ${Şans3} |

> ${Emojis.Para} Kaybedilen para: **${Miktar} HC**
`)
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    await interaction.followUp({embeds: [Kaybettin]})
  }
  
  }
}