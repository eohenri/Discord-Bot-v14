const {
  EmbedBuilder
} = require("discord.js");
const User = require("../../schema/user");
const Guild = require("../../schema/guild");
const abreviar = require("../../util/abreviar");
const colors = require("../../util/colors");

module.exports = {
  name: "depositar",
  category: "economy",
  aliases: ["dep", "banco"],
  run: async (client, message, args, prefix) => {

    await message.channel.sendTyping();

    let prefixo = prefix || "s";
    const userdb = await User.findOne({ _id: message.author.id });

    if (!userdb) return message.reply({ content: `${message.author}, Você não coletou o daily hoje!` });
    let valor = args[0];

    if (!valor) return message.reply({ content: `${message.author}, Você deve utilizar no formato:\n\`${prefixo}depositar <quantia>\`` });
    if (!/^[A-Za-z0-9]+$/.test(valor)) return message.reply({ content: `${message.author}, Você deve fornecer apenas números inteiros e positivos.`, ephemeral: true });
    if (valor.includes("all")) valor = userdb.economia.ametistas;
    if (["m", "k"].some(text => args[0].toLowerCase().endsWith(text)) === true) valor = await abreviar(valor);
    if (isNaN(valor)) return message.reply({ content: `${message.author}, Você deve fornecer apenas números inteiros e positivos.` })
    if (userdb.economia.ametistas < valor || valor < 1) return message.reply({ content: `${message.author}, Você não possui a quantia do deposito.` });

    await User.findByIdAndUpdate({ _id: message.author.id }, { $inc: { "economia.ametistas": -valor, "economia.banco": valor } });

    message.reply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({ name: `${message.author.username}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` })
          .setTitle("<:BAU:1234476570928746516> Depósito bancário")
          .setDescription(`Você depositou **<:AMETISTA:1234467310958411858> ${Number(valor).toLocaleString()} ametistas** com sucesso!`)
          .setColor("#942FFA")
      ]
    });

  }
}

//dev athena
