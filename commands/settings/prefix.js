const {
    EmbedBuilder,
    PermissionsBitField
} = require("discord.js");
const Guild = require("../../schema/guild");
module.exports = {
    name: "prefixo",
    category: "settings",
    aliases: ["prefix", "setprefix"],
    run: async (client, message, args) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return message.reply({ content: `${message.author}, Você não possui permissão de gerenciar servidor!` });
        const prefixo = args[0];
        if (!prefixo) return message.reply({ content: "Ops! Para que o comando funcione você precisa informar o novo prefixo!" });
        await Guild.findByIdAndUpdate({ _id: message.guild.id }, { $set: { "prefix": prefixo, } });
        message.reply({ content: `${message.author}, Meu prefixo em seu servidor foi alterado para \`${prefixo}\` com sucesso.` });
    }
}
//
