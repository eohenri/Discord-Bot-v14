const {
    EmbedBuilder,
    PermissionsBitField
} = require('discord.js');

module.exports = {
    name: 'desbanir',
    category: "moderation",
    aliases: ['unban'],
    run: async (client, message, args) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return message.reply({ content: `${message.author}, Você não possui permissão de banir membros!` });
        const id = args[0];
        if (!id) return message.reply({ content: `${message.author}, Você não informou o ID do usuário para remover o banimento!` });
        if (isNaN(id)) return message.reply({ content: `${message.author}, Você deve somente utilizar números para o ID do usuário!` });
        const user = await client.users.fetch(id).catch(() => null);
        if (!user) return message.reply({ content: `${message.author}, Você forneceu um usuário inválido ou desconhecido!` });
        message.reply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: `${message.author.username}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` })
                    .setDescription(`<a:CERTO:1213127081890938982> **|** O banimento de "**${user.username} - (ID: ${id})**" foi retirado com sucesso!`)
                    .setColor("#6d00a8")
                    .setTimestamp()
            ]
        });
        message.guild.members.unban(user.id, { reason: `Desbanido(a) por ${message.author.username}!` }).catch(() => {});
    }
}
// autir Mel
