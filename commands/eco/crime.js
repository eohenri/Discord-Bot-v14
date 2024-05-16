const {
  EmbedBuilder
} = require("discord.js");
const User = require("../../schema/user");
const colors = require("../../util/colors");
const emoji = require("../../util/emotes")

module.exports = {
  name: "crime",
  category: "economy",
  aliases: ["cr"],
  run: async (client, message, args, prefix) => {
    let p = prefix || "s";
    const userdb = await User.findOne({ _id: message.author.id });
    if (!userdb) return message.reply({ content: `${message.author}, Você não coletou o daily hoje!` });
    if (Date.now() < userdb.cooldowns.crime) return message.reply({ content: `<:nysa_cooldown:1217515334924505201> **|** Volte <t:${~~(userdb.cooldowns.crime / 1000)}:R> para cometer crimes novamente!` });
    const crimes = ["roubou duas pessoas na farmácia", "assaltou um motorista no posto", "roubou guarda de banco", "furtou sua tia", "furtou uma velhinha no cemiterio"];
    const result = crimes[Math.floor(Math.random() * crimes.length)];
    const amount = Math.floor(Math.random() * 200) + 1000;
    message.reply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({ name: `${message.author.username} ${result}!`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` })
          .setColor(colors.dark)
          .setThumbnail("https://cdn-icons-png.flaticon.com/512/5904/5904339.png")
          .setDescription(`Você fugiu levando **${emoji.moeda} ${Number(amount).toLocaleString()} gemas sujas**!\n\n${emoji.add} (**${Number(amount).toLocaleString("en-US", { notation: "compact", maximumFractionDigits: 2, })}**)`)
          .setFooter({ text: `Utilize ${p}lavagem para realizar a lavagem!` })
      ]
    });
    await User.updateOne({ _id: message.author.id }, { $inc: { "economia.crime": amount }, $set: { "cooldowns.crime": Date.now() + 3600000 } });
  }
}//dev mel
