const {
  EmbedBuilder
} = require("discord.js");
const colors = require("./colors");

module.exports = async (client, msg, i) => {
  msg.edit({
    embeds: [
      new EmbedBuilder()
        .setAuthor({ name: `${i.user.username}`, iconURL: `${i.user.displayAvatarURL()}` })
        .setTitle("Shop - Sementes")
        .setColor(colors.yellow)
        .addFields({
          name: "🥔 | Batata",
          value: "Preço: **200** moedas"
        }, {
          name: "🌽 | Milho",
          value: "Preço: **300** moedas"
        }, {
          name: "🌾 | Arroz",
          value: "Preço: **400** moedas"
        }, {
          name: "🌿 | Feijão",
          value: "Preço: **500** moedas"
        }, {
          name: "🥕 | Cenoura",
          value: "Preço: **600** moedas"
        }, {
          name: "🍆 | Beterraba",
          value: "Preço: **700** moedas"
        })
    ],
    components: []
  });
}
