const {
    EmbedBuilder,
    PermissionsBitField,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');
const colors = require("../../util/colors");

module.exports = {
    name: 'mute',
    category: "moderation",
    aliases: ['castigo'],
    run: async (client, message, args, prefix) => {
        let p = prefix || "s";
        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return message.reply({ content: `${message.author}, Você não possui permissão de banir membros!` });
        let user = message.mentions.users.first() || client.users.cache.get(args[0]);
        if (!args[0]) return message.reply({ content: `${message.author}, Mencione ou informe o ID do usuário para o castigo!` });
        if (!user) return message.reply({ content: `${message.author}, O usuário informado não encontrado.` });
        if (user.id === message.author.id) return message.reply({ content: `${message.author}, Você não pode mutar a si mesmo.` });
        if (user.id === client.user.id) return message.reply({ content: `${message.author}, Você não pode me mutar usando meu próprio comando.` });
        let member = await message.guild.members.cache.get(user.id);
        if (!member) return message.reply({ content: `${message.author}, O membro não foi encontrado ou não está nesse servidor.` });
        let time = args[1];
        if (!time) return message.reply({ content: `${message.author}, Você não informou o tempo do castigo!` });
    }
}