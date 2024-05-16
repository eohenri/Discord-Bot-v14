const {
  EmbedBuilder,
  PermissionsBitField
} = require("discord.js");
const colors = require("../../util/colors");

module.exports = {
  name: "unlock",
  aliases: ["destravar"],
  category: "moderation",
  run: async (client, message, args, prefix) => {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return message.reply({ content: `${message.author}, Você não possui permissão de gerenciar canais.` });
    let p = prefix || "s";
    message.reply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({ name: `${message.author.username}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` })
          .setDescription(`🔓 O canal foi destravado com sucesso!`)
          .setColor(colors.white)
          .setFooter({ text: `Utilize ${p}lock para travar o chat novamente.` })
      ]
    });
  }
}
