const {
  EmbedBuilder,
  PermissionsBitField
} = require("discord.js");
const colors = require("../../util/colors");

module.exports = {
  name: "lock",
  aliases: ["travar"],
  category: "moderation",
  run: async (client, message, args, prefix) => {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return message.reply({ content: `${message.author}, Você não possui permissão de gerenciar canais.` });
    let p = prefix || "s";
    message.reply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({ name: `${message.author.username}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` })
          .setDescription(`🔒 O canal foi travado com sucesso!`)
          .setColor(colors.white)
          .setFooter({ text: `Utilize ${p}unlock para destravar o chat novamente.` })
      ]
    });
  }
}
