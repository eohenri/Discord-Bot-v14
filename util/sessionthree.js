const {
  EmbedBuilder
} = require("discord.js");
const colors = require("./colors");

module.exports = async (client, msg, i) => {
  msg.edit({
    embeds: [
      new EmbedBuilder()
        .setAuthor({ name: `${i.user.username}`, iconURL: `${i.user.displayAvatarURL()}` })
        .setTitle("Shop - Alimentos")
        .setColor(colors.yellow)
        .addFields({
          name: "🍟 | Batata Frita",
          value: "Preço: **2.000** moedas"
        }, {
          name: "🍗 | Frango Assado",
          value: "Preço: **4.000** moedas"
        }, {
          name: "🥪 | Sanduiche",
          value: "Preço: **5.000** moedas"
        }, {
          name: "🍔 | Hamburgue",
          value: "Preço: **6.400** moedas"
        }, {
          name: "🍕 | Pizza",
          value: "Preço: **8.000** moedas"
        })
    ],
    components: []
  });
}
