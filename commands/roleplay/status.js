const {
  EmbedBuilder
} = require('discord.js');
const User = require("../../schema/user");
const colors = require("../../util/colors");

module.exports = {
  name: "status",
  category: "roleplay",
  aliases: ["civil", "amigos"],
  run: async (client, message, args) => {
    const userdb = await User.findById({ _id: message.author.id });
    if (!userdb) return message.reply({ content: `${message.author}, Você ainda não coletou seu daily.` });
    message.reply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({ name: `${message.author.username}`, iconURL: `${message.author.displayAvatarURL()}` })
          .setColor(colors.white)
          .addFields({
            name: "💍 Casamento:",
            value: `${userdb.casar.casado ? `Casado(a) com <@${userdb.casar.com}>!` : "Solteiro(a)!"}`
          }, {
            name: "👊 Amizade:",
            value: `${userdb.social.friend ? `Melhor amigo(a) <@${userdb.social.friend}>!` : "Nenhum amigo(a)!"}`
          }, {
            name: "⚡ Experiência:",
            value: `Possui **${userdb.social.energia.toLocaleString()}** de XP!`
          }, {
            name: "💰 Dinheiro sujo:",
            value: `Possui **${userdb.economia.crime.toLocaleString()} moedas** sujas!`
          })
      ]
    });
  }
}
