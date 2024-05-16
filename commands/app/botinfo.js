const {
  EmbedBuilder
} = require("discord.js");
const colors = require("../../util/colors");
const emoji = require("../../util/emotes")

module.exports = {
  name: 'botinfo',
  category: "app",
  aliases: ['infobot', 'bi', 'bot-info', 'ib'],

  run: async (client, message, args) => {
 
    await message.channel.sendTyping();

    const henri = await client.users.fetch("1046838112833253486");
    const mel = await client.users.fetch("1148575199269228655");
 
    message.reply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({ name: `${client.user.username} - Sobremim`, iconURL: `${client.user.displayAvatarURL()}` })
          .setDescription(`**Olá**, sou uma bot brasileira de economia, utilidades e moderação para seu servidor!`)
          .setThumbnail(`${client.user.displayAvatarURL()}`)
          .addFields({
            name: "Criadores",
            value: `\`${mel.username}\`, \`${henri.username}\``,
            inline: true
          }, {
            name: "Servidores",
            value: `${Number(client.guilds.cache.size).toLocaleString()}`,
            inline: true
          }, {
            name: "Usuários",
            value: `${Number(client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)).toLocaleString().replace(",", ".")}`,
            inline: true
          }, {
            name: "Comandos",
            value: `${client.comandos.size}`,
            inline: true
          }, {
            name: "Uptime",
            value: `<t:${parseInt(client.readyTimestamp / 1000)}:R>`,
            inline: true
          }, {
            name: "Links",
            value: `${emoji.ponto_branco} [Servidor de Suporte](https://discord.gg/y7fCryejuE)\n${emoji.ponto_branco} [Vote em mim](https://top.gg/bot/1108562673899143168)\n${emoji.ponto_branco} [Canal do Youtube](https://www.youtube.com/@StarGabyy)\n${emoji.ponto_branco} [SpeedCloud](https://discord.com/invite/3B4jxt22td)`
          })
          .setColor("#942FFA")
          .setTimestamp()
          .setFooter({ text: `Solicitado por ${message.author.username}`, iconURL: `${message.author.displayAvatarURL()}` })
      ]
    });
  }
}
