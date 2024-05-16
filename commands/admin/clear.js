const {
    EmbedBuilder,
    PermissionsBitField
} = require('discord.js');

module.exports = {
    name: 'clear',
    category: "moderation",
    aliases: ['limpar'],
    run: async (client, message, args) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            message.reply({ content: `<a:Erro:1178773952659726346> › ${message.author}, Ei, você não possui permissão de gerenciar mensagens!` });
            return;
        }
        const prefix = "s";
        if (!args[0]) return message.reply({ content: `<a:Erro:1178773952659726346> › ${message.author}, Você deve utilizar o comando no formato correto: \`${prefix}clear <quantia>\`` });
        const deleteCount = parseInt(args[0], 10);
        if (!deleteCount || deleteCount < 1 || deleteCount > 1000) return message.message.reply({ content: `<a:Erro:1178773952659726346> › ${message.author}, Você deve fornecer um número de até **1000 mensagens** a serem excluídas!` })
        const fetched = await message.channel.messages.fetch({
            limit: deleteCount + 1
        });
        try {
            await message.channel.bulkDelete(fetched);
        } catch (error) {
            message.reply({ content: `<a:Erro:1178773952659726346> › ${message.author}, Não foi possível deletar mensagens devido a: \`${error}\`` })
        }
        const msg = await message.channel.send({ content: `<:FOFA:1180843204287922289> **| ${args[0]} mensagens limpas nesse chat!\n  por: ${message.author}**` })
        setTimeout(async () => {
            msg.delete()
        }, 5000)
    }
}
