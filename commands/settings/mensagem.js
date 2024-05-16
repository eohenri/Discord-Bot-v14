const {
    EmbedBuilder,
    PermissionsBitField
} = require("discord.js");
const Guild = require("../../schema/guild");
module.exports = {
    name: "mensagem",
    category: "settings",
    aliases: ["msgwelcome"],
    run: async (client, message, args) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return message.reply({ content: `${message.author}, Você não possui permissão de gerenciar servidor!` });
        const texto = args.join(" ");
        if (!texto) return message.reply({ content: "Ops! Para que o comando funcione você precisa informar sua nova mensagem!" });
        await Guild.findByIdAndUpdate({ _id: message.guild.id }, { $set: { "welcomejoin.messageDescription": texto, } });
        const embed = new EmbedBuilder()
            .setAuthor({
                name: `${client.user.username}`,
                iconURL: `${client.user.displayAvatarURL()}`
            })
            .setTitle("Nova mensagem definida no bem-vindo!")
            .setColor("#f9829b")
            .setDescription(`Prévia:\n\n\`${texto}\`.`)
            .setTimestamp();
        message.reply({ embeds: [embed] });
    }
}