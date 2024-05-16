const {
  EmbedBuilder
} = require("discord.js");
const User = require("../../schema/user");
const Guild = require("../../schema/guild");
const abreviar = require("../../util/abreviar");
const colors = require("../../util/colors");
const Owners = [
  "1148575199269228655", //Mel
  "797922004920827904",
  "1046838112833253486" //henri
];// Coloque seu ID

module.exports = {
  name: "remover-money",
  category: "developer",
  aliases: ["removm", "remover-coins", "rmvcoins", "rmvmoney"],
  run: async (client, message, args) => {
    const prefix = "s."; //prefixo
    if (!Owners.includes(message.author.id)) return message.reply({ content: `${message.author}, Apenas o meus desenvolvedores podem utilizar este comando!` })
    if (!args[0]) return message.reply({ content: `${message.author}, Você precisa mencionar algum usuário!` });
    let user = message.mentions.users.first() || (await client.users.fetch(args[0]));
    if (!user) return message.reply({ content: `${message.author}, Você precisa mencionar algum usuário!` });
    let valor = args[1];
    if (!valor) return message.reply({ content: `${message.author}, Você deve usar o comando no formato correto: \`${prefix}addcoins @usuário <quantia>\`` });
    if (!/^[A-Za-z0-9]+$/.test(valor)) return message.reply({ content: `${message.author}, Você não pode usar símbolos no meio de números, quebra de linha.`, ephemeral: true });
    if (["m", "k"].some(text => args[1].toLowerCase().endsWith(text)) === true) valor = await abreviar(valor);
    if (isNaN(valor)) return message.reply({ content: `${message.author}, Você não informou um número válido!` })
    let userdb = await User.findOne({ _id: user.id });
    if (!userdb) {
      const createDocUserr = new User({ _id: user.id })
      await createDocUser.save();
      userdb = await User.findOne({ _id: user.id });
    };
    await User.findByIdAndUpdate({ _id: user.id }, { $inc: { "economia.ametistas": -valor, } });
    message.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("⚡ Remover moedas")
          .setDescription(`Você removeu **${Number(valor).toLocaleString()} moedas** de ${user} com sucesso!`)
          .setColor(colors.white)
          .setTimestamp()
          .addFields({ name: "AVISO:", value: "Comando disponivel apenas para meus criadores!" })
          .setFooter({ text: `Solicitado por ${message.author.username}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` })
      ]
    });
  }
}
//por mika
