const {
  EmbedBuilder
} = require("discord.js");
const User = require("../../schema/user");
const colors = require("../../util/colors");

module.exports = {
  name: "semanal",
  category: "economy",
  aliases: ["sm", "weekly"],
  run: async (client, message, args, prefix) => {

    let p = prefix || "s";

    const userdb = await User.findOne({ _id: message.author.id });

    if (!userdb) return message.reply({ content: `${message.author}, Você não coletou o daily hoje!` });
    if (Date.now() < userdb.cooldowns.semanal) return message.reply({ content: `<:nysa_cooldown:1217515334924505201> **|** Volte <t:${~~(userdb.cooldowns.semanal / 1000)}:R> para receber seu semanal novamente!` });

    const amount = Math.floor(Math.random() * 1200) + 5600;

    message.reply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({ name: `${message.author.username}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` })
          .setDescription(`Você coletou o semanal e recebeu **<:AMETISTA:1234467310958411858> ${Number(amount).toLocaleString()} ametistas**!`)
          .setColor("#942FFA")
      ]
    });

    await User.findByIdAndUpdate({ _id: message.author.id }, { $inc: { "economia.ametistas": amount, "economia.energia": 15 }, $set: { "cooldowns.semanal": Date.now() + 604800000 } });

  }
}

//dev athena