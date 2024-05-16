const {
  EmbedBuilder
} = require("discord.js");
const User = require("../../schema/user");
const colors = require("../../util/colors");

module.exports = {
  name: "pescar",
  category: "economy",
  aliases: ["psc", "fish", "pescaria"],
  run: async (client, message, args, prefix) => {

    let p = prefix || "s";

    const userdb = await User.findOne({ _id: message.author.id });

    if (!userdb) return message.reply({ content: `${message.author}, Você não coletou o daily hoje!` });
    if (Date.now() < userdb.cooldowns.pescar) return message.reply({ content: `<:nysa_cooldown:1217515334924505201> **|** Volte <t:${~~(userdb.cooldowns.pescar / 1000)}:R> para uma nova pescaria!` });

    const result = Math.floor(Math.random() * 20) + 50;
    const amount = Math.floor(Math.random() * 100) + 900;

    message.reply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({ name: `${message.author.username}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` })
          .setDescription(`Você vendeu \`${result}kg\` de peixes e faturou **<:AMETISTA:1234467310958411858> ${Number(amount).toLocaleString()} ametistas**!`)
          .setColor("#942FFA")
      ]
    });

    await User.updateOne({ _id: message.author.id }, { $inc: { "economia.ametistas": amount, "economia.energia": 12 }, $set: { "cooldowns.pescar": Date.now() + 3600000 } });

  }
}

//dev athena