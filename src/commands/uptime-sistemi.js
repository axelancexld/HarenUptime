const { Discord, EmbedBuilder, ChannelType, ButtonBuilder, ActionRowBuilder, ButtonStyle, ModalBuilder, TextInputStyle, TextInputBuilder, InteractionType, PermissionsBitField } = require ("discord.js")
const Emojis = require("../haren/emojis.json")
const Colors = require("../haren/colors.json")
const db = require("croxydb")

module.exports = {
  slash: true, 
  enable: true, 
  dbl: false, 
  name: ['uptime-sistemi'],  
  description: 'Uptime sistemini kurarsınız.',
  options: [
    { 
      name: "kanal", 
      description: "Ayarlanacak kanal.", 
      type: 7,
      required: false
    }
  ],
  
async execute(client, interaction) {
  
  await interaction.deferReply()
  
  const Kanal = interaction.options.getChannel('kanal') || interaction.channel
  
  const YetkiYok = new EmbedBuilder()
    .setColor(Colors.Red)
    .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
    .setDescription(`${Emojis.Çarpı} Bu komutu kullanabilmek için \`Yönetici\` yetkisine sahip olmalısın.`)
    .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
    .setTimestamp()
  if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.followUp({embeds: [YetkiYok]})
  const MetinKanalı = new EmbedBuilder()
    .setColor(Colors.Red)
    .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
    .setDescription(`${Emojis.Çarpı} Sistemi sadece metin kanalına ayarlayabilirsin.`)
    .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
    .setTimestamp()
  if(Kanal.type !== ChannelType.GuildText) return await interaction.followUp({embeds: [MetinKanalı]})
  
  const Oldu = new EmbedBuilder()
    .setColor(Colors.Green)
    .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
    .setDescription(`${Emojis.Tik} Uptime sistemi ${Kanal} kanalına ayarlandı.`)
    .setFooter({text:client.user.username, iconURL: client.user.avatarURL()}) 
    .setTimestamp()
  await interaction.followUp({embeds: [Oldu]})
  
  const Uptime = new EmbedBuilder()
    .setColor(Colors.Yellow)
    .setAuthor({name: interaction.guild.name, iconURL: interaction.guild.iconURL()}) 
    .setDescription(`
> **Uptime sistemine hoşgeldiniz.**
            
> Aşağıdaki \`Ekle\` - \`Sil\` - \`Liste\` - \`Düzenle\` butonları ile sistemi kullanabilirsiniz.
             
> Diğer komutlarıma erişmek için </yardım:0> komutunu kullanabilirsiniz.
`)
    .setFooter({text:client.user.username, iconURL: client.user.avatarURL()}) 
    .setImage(`https://cdn.glitch.global/a05428fd-4cef-4667-a4b6-a17f503dbea5/standard.gif?v=1679220526653`)
    .setTimestamp()
  const Butonlar = new ActionRowBuilder()
    .addComponents(new ButtonBuilder()
      .setEmoji(Emojis.Link)
      .setLabel("Ekle")
      .setStyle(ButtonStyle.Secondary)
      .setCustomId("ekle"))
    .addComponents(new ButtonBuilder()
      .setEmoji(Emojis.Sil)
      .setLabel("Sil")
      .setStyle(ButtonStyle.Secondary)
      .setCustomId("sil"))
    .addComponents(new ButtonBuilder()
      .setEmoji(Emojis.Dosya)
      .setLabel("Liste")
      .setStyle(ButtonStyle.Secondary)
      .setCustomId("liste"))
    .addComponents(new ButtonBuilder()
      .setEmoji(Emojis.Yenile)
      .setLabel("Düzenle")
      .setStyle(ButtonStyle.Secondary)
      .setCustomId("düzenle"))
  Kanal.send({embeds: [Uptime], components: [Butonlar]})
  }
}