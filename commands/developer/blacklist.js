const {
  EmbedBuilder
} = require("discord.js");
const User = require("../../schema/user");
const Owners = [
  "1046838112833253486" //henri
];
const colors = require("../../util/colors");

module.exports = {
  name: "blacklist",
  category: "developer",
  aliases: ["block"],
  run: async (client, message, args) => {
    if (!Owners.includes(message.author.id)) return message.reply({ content: `<a:Erro:1178773952659726346> › **${message.author.username}**, Apenas o meus desenvolvedores podem utilizar este comando!` })
    let user = message.mentions.users.first() || (await client.users.fetch(args[0]));
    if (!user) return message.reply({ content: `<a:Erro:1178773952659726346> › **${message.author.username}**, Você precisa mencionar algum usuário!` });
    let reason = args.slice(1.2).join(" ");
    if (!reason) reason = "Não informado";
    await User.findByIdAndUpdate({ _id: user.id }, { $set: { "blacklist.banido": true, "blacklist.motivo": reason, "blacklist.time": Date.now(), } });
    message.reply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
          .setTitle("<:girlfbi:1217187900924625016> Adicionado na lista negra!")
          .setDescription(`O usuário **${user.username}** foi proibido de utilizar meus comandos!`)
          .setColor(colors.yellow)
          .setThumbnail(user.displayAvatarURL({ dyncamic: true }))
          .addFields({ name: "Motivo da Punição:", value: `${reason}` })
          .setTimestamp()
      ]
    });
  }
}
//
//
