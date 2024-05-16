const {
  EmbedBuilder
} = require("discord.js");
const kakashi = require('anime-actions');
const colors = require("../../util/colors");

module.exports = {
  name: 'abrace',
  category: "fun",
  aliases: ['hug', 'abraço', 'abraçar'],
  run: async (client, message, args) => {
    const user = message.mentions.users.first();
    if (!user) return message.reply(`${message.author}, O usuário não foi encontrado ou mencionado.`);
    const image = await kakashi.hug();
    message.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription(`${message.author} deu um abraçou em ${user}!`)
          .setImage(`${image}`)
          .setColor(colors.girl)
          .setTimestamp()
      ]
    });
  }
}
// autor Mel