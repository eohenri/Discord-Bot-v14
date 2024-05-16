const {
  EmbedBuilder
} = require("discord.js");
const colors = require("./colors");

module.exports = async (client, msg, i) => {
  msg.edit({
    embeds: [
      new EmbedBuilder()
        .setAuthor({ name: `${i.user.username}`, iconURL: `${i.user.displayAvatarURL()}` })
        .setTitle("Shop - Ferramentas")
        .setColor(colors.yellow)
        .addFields({
          name: "🎣 | Vara de pescar",
          value: "Preço: **2.000** moedas"
        }, {
          name: "⛏ | Picareta",
          value: "Preço: **3.000** moedas"
        }, {
          name: "🔍 | Lupa",
          value: "Preço: **4.000** moedas"
        }, {
          name: "🪣 | Balde de iscas",
          value: "Preço: **2.400** moedas"
        }, {
          name: "🔭 | Telescópio",
          value: "Preço: **4.000** moedas"
        })
    ],
    components: []
  });
}
