const {
  EmbedBuilder
} = require("discord.js");
const cor = require("../../util/colors")
const emoji = require("../../util/emotes")

module.exports = {
  name: 'partners',
  category: "app",
  aliases: ['parceiros', 'socios'],
  run: async (client, message, args) => {
    message.reply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
          .setTitle(` ${emoji.hapy} Parceiros oficiais da Star Gaby!`)
          .setDescription(`**Oii**, veja abaixo as comunidades & empresas que me apoiam para continuar a ajudar e divertir os servidores onde estou.\n🚀 | [Speed cloud](https://discord.com/invite/3B4jxt22td)\n💙 | [Slimeread](https://discord.com/invite/slimeread)`)
          .setFooter({ text: `💜 Sou muito grata a todos os meus apoiadores!` })
          .setThumbnail(`${client.user.displayAvatarURL()}`)
          .setColor(cor.purble)
      ]
    });
  }
}
