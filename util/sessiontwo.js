const {
  EmbedBuilder
} = require("discord.js");
const colors = require("./colors");

module.exports = async (client, msg, i) => {
  msg.edit({
    embeds: [
      new EmbedBuilder()
        .setAuthor({ name: `${i.user.username}`, iconURL: `${i.user.displayAvatarURL()}` })
        .setTitle("Shop - Armamentos")
        .setColor(colors.yellow)
        .addFields({
          name: "🔫 | Revolver",
          value: "Preço: **6.000** moedas"
        }, {
          name: "🦺 | Colete",
          value: "Preço: **3.000** moedas"
        }, {
          name: "💥 | Munição",
          value: "Preço: **2.000** moedas"
        }, {
          name: "🧨 | Dinamite",
          value: "Preço: **5.400** moedas"
        }, {
          name: "🏹 | Arco e Flecha",
          value: "Preço: **3.000** moedas"
        })
    ],
    components: []
  });
}
