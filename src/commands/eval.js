const { Discord, EmbedBuilder, ChannelType, ButtonBuilder, ActionRowBuilder, ButtonStyle, ModalBuilder, TextInputStyle, TextInputBuilder, InteractionType, PermissionsBitField } = require ("discord.js")
const Emojis = require("../haren/emojis.json")
const Colors = require("../haren/colors.json")
const db = require("croxydb")

module.exports = {
  slash: true, 
  enable: true, 
  dbl: false, 
  name: ['eval'],  
  description: 'Kod denersiniz.',
  options: [
    { 
      name: "kod", 
      description: "Denenecek kod.", 
      type: 3,
      required: true
    }
  ],
  
async execute(client, interaction) {
  
  await interaction.deferReply()
  
  const Sahip = new EmbedBuilder()
    .setColor(Colors.Red)
    .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
    .setDescription(`${Emojis.Çarpı} Bu komutu sadece geliştiriciler kullanabilir.`)
    .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
    .setTimestamp()
  if(interaction.user.id !== "361508226300248065" && interaction.user.id !== "361508226300248065" && interaction.user.id !== "361508226300248065" && interaction.user.id !== "367982908037791746") return await interaction.followUp({embeds: [Sahip]})

  const kod = interaction.options.getString('kod')
  try {
    var evaled = clean(await eval(kod))
    if (evaled.match(new RegExp(`${client.token}`, "g")));
    const Token = new EmbedBuilder()
      .setDescription(`${Emojis.Çarpı} Bu şekilde token alınamaz.`)
      .setColor(Colors.Red)
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    if (evaled.includes(client.token)) return await interaction.followUp({embeds: [Token]})
    const Eval = new EmbedBuilder()
      .addFields({name: `${Emojis.Sağ} Kod girişi`, value: `\`${kod}\``})
      .addFields({name: `${Emojis.Sol} Kod çıkışı`, value: `\`${evaled}\``}) 
      .setColor(Colors.Green)
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    await interaction.followUp({embeds: [Eval]})
  } catch (err) {
    const Hata = new EmbedBuilder()
      .addFields({name: `${Emojis.Sağ} Kod girişi`, value: `\`${kod}\``})
      .addFields({name: `${Emojis.Ünlem} Hata`, value: `\`${err}\``}) 
      .setColor(Colors.Red)
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    await interaction.followUp({embeds: [Hata]});
  }
    function clean(text) {
    if(typeof text !== "string")
      text = require("util").inspect(text, { depth: 0 })
      text = text
        .replace(/`/g, "`" + String.fromCharCode(8203))
        .replace(/@/g, "@" + String.fromCharCode(8203))
      return text
    }
  }
}
  