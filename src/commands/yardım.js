const { Discord, EmbedBuilder, ChannelType, ButtonBuilder, ActionRowBuilder, ButtonStyle, ModalBuilder, TextInputStyle, TextInputBuilder, InteractionType, PermissionsBitField } = require ("discord.js")
const Emojis = require("../haren/emojis.json")
const Colors = require("../haren/colors.json")
const db = require("croxydb")

module.exports = {
  slash: true, 
  enable: true, 
  dbl: false, 
  name: ['yardım'],  
  description: 'HarenUptime yardım menüsünü gösterir.',
  
async execute(client, interaction) {
  
  await interaction.deferReply()
  
  const Duyurular = db.fetch(`Duyurular`)
  let Duyuru
  if(!Duyurular) {
    Duyuru = `${Emojis.Kırmızı} \`Aktif bir duyuru bulunmuyor.\``
  } else {
    Duyuru = `${db.fetch(`Duyurular`).map(D => `> ${Emojis.Sağ} \`${D}\``).join("\n") || `${Emojis.Kırmızı} \`Aktif bir duyuru bulunmuyor.\``}`
  }
  const Yardım = new EmbedBuilder()
    .setColor(Colors.Yellow)
    .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
    .addFields(
      {
        name: `${Emojis.Duyuru} Bot duyuruları`,
        value: `${Duyuru}`
      },
      {
        name: `${Emojis.Bot} Bot komutları`,
        value: `
> </yardım:0> HarenUptime yardım menüsünü gösterir.

> </istatistik:0> Botun istatistiklerini gösterir.

> </ping:0> Botun gecikme sürelerini gösterir.

> </davet:0> Botun bağlantılarını gösterir.

> </link ekle:0> Sisteme link eklersiniz.

> </link sil:0> Sistemdeki linkinizi silersiniz.

> </link düzenle:0> Sistemdeki linkinizi değiştirirsiniz.

> </link liste:0> Sisteme eklemiş olduğunuz linkleri gösterir.

> </link say:0> Sistemdeki linklerin sayısını gösterir.

> </premium kontrol:0> Premium üyeliğinizi kontrol edersiniz.

> </promosyon kullan:0> Promosyon kodu kullanırsınız.
`})
    .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
    .setTimestamp()
    .setImage(`https://cdn.glitch.global/a05428fd-4cef-4667-a4b6-a17f503dbea5/standard.gif?v=1679220526653`)
  await interaction.followUp({embeds: [Yardım]})
  
  }
}
  