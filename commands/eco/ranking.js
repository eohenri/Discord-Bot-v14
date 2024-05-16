const {
  EmbedBuilder
} = require("discord.js");
const User = require("../../schema/user");
const colors = require("../../util/colors");

module.exports = {
  name: "top",
  category: "economy",
  aliases: ["ranking", "rank", "placar"],
  run: async (client, message, args) => {
    await message.channel.sendTyping();
    let lista = await User.find();
    let placar = lista.sort((a, b) => a.economia.ametistas + a.economia.banco < b.economia.ametistas + b.economia.banco ? 1 : -1);
    let content = "";
    for (let i = 0; i <= 9; i++) {
      let user = await client.users.fetch(`${placar[i]._id}`);
      if (!user) user = client.user;
      let ametistas = placar[i].economia.ametistas || 0;
      let bank = placar[i].economia.banco || 0;
      content += `#${i + 1}: **${user.username}**` + "\n" + `<:invisivel:1216703440466608209> 🪙 \`${Math.floor(ametistas + bank).toLocaleString()}\`\n`
    }
    message.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Ranking dos usuários mais ricos da StarGaby! 💸")
          .setColor(colors.default)
          .setDescription(`\n${content}`)
          .setTimestamp()
          .setFooter({ text: `Solicitado por ${message.author.username}`, iconURL: `${message.author.displayAvatarURL()}` })
      ]
    });
  }
}
