const {
    EmbedBuilder,
    PermissionsBitField
} = require('discord.js');
const colors = require("../../util/colors");

module.exports = {
    name: 'remover-cargo',
    category: "moderation",
    aliases: ['remov-cargo', 'removerole', 'tirarcargo', 'rmvr'],
    run: async (client, message, args) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) return message.reply({ content: `${message.author}, Você não possui permissão de gerenciar cargos!` });
        let user = message.mentions.users.first() || client.users.cache.get(args[0]);
        if (!args[0]) return message.reply({ content: `${message.author}, Mencione ou informe o ID de algum usuário para remover o cargo!` });
        if (!user) return message.reply({ content: `${message.author}, O usuário mencionado não foi encontrado!` });
        let member = await message.guild.members.cache.get(user.id);
        if (!member) return message.reply({ content: `${message.author}, O membro não foi encontrado ou não está no servidor!` });
        let cargo = message.guild.roles.cache.find(role => role.name === args[1]) || message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
        if (!cargo) return message.reply({ content: `${message.author}, O cargo não foi encontrado!` });
        if (cargo.managed) return message.reply({ content: `${message.author}, O cargo é muito maior que o meu!` });
        if (message.guild.roles.everyone.id === cargo.id) return message.reply({ content: `${message.author}, Esse cargo não pode ser gerenciado pois é global!` });
        if (message.guild.members.me.roles.highest.position < cargo.position) return message.reply({ content: `${message.author}, Esse cargo é maior que o meu!` });
        try {
            await member.roles.remove(cargo.id);
            message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({ name: `${message.author.username}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` })
                        .setDescription(`<a:CERTO:1213127081890938982> **|** O cargo foi removido de **${member.user.username}**!`)
                        .setColor("#6d00a8")
                        .setTimestamp()
                ]
            });
        } catch (err) {
            return message.channel.send({ content: `${message.author}, Falha em remover o cargo!` });
        }
    }
}
// autor Mel
