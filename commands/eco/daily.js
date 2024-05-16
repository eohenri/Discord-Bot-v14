const {
  EmbedBuilder
} = require('discord.js');
const User = require("../../schema/user");
const colors = require("../../util/colors");

module.exports = {
  name: 'daily',
  category: "economy",
  aliases: ['diario', 'coleta'],
  run: async (client, message, args) => {

    await message.channel.sendTyping();

    let userdb = await User.findById({ _id: message.author.id });

    if (!userdb) {
      const createUser = new User({ _id: message.author.id });
      await createUser.save();
      userdb = await User.findById({ _id: message.author.id });
    }

    if (Date.now() < userdb.cooldowns.daily) return message.reply({ content: `<:nysa_cooldown:1217515334924505201> **|** Volte <t:${~~(userdb.cooldowns.daily / 1000)}:R> para receber seu diário novamente!` });

    const amount = Math.floor(Math.random() * 1200) + 2000;

    message.reply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({ name: `${message.author.username}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` })
          .setDescription(`Você coletou o daily e recebeu **<:AMETISTA:1234467310958411858> ${Number(amount).toLocaleString()} ametistas**!`)
          .setColor("#942FFA")
      ]
    });

    await User.findByIdAndUpdate({ _id: message.author.id }, { $inc: { "economia.ametistas": amount }, $set: { "cooldowns.daily": Date.now() + 86400000 } });

  }
};

// dev athena
