const {
    EmbedBuilder,
    PermissionsBitField,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');
const colors = require("../../util/colors");

module.exports = {
    name: 'banir',
    category: "moderation",
    aliases: ['ban'],
    run: async (client, message, args) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return message.reply({ content: `${message.author}, Você não possui permissão de banir membros!` });
        let user = message.mentions.users.first() || client.users.cache.get(args[0]);
        if (!args[0]) return message.reply({ content: `${message.author}, Mencione ou informe o ID do usuário para o banimento!` });
        if (!user) return message.reply({ content: `${message.author}, O usuário informado não encontrado.` });
        if (user.id === message.author.id) return message.reply({ content: `${message.author}, Você não pode banir a si mesmo!` });
        if (user.id === client.user.id) return message.reply({ content: `${message.author}, Você não pode me banir usando meu próprio comando!` });
        let member = await message.guild.members.cache.get(user.id);
        if (!member) return message.reply({ content: `${message.author}, O membro não foi encontrado ou não está nesse servidor!` });
        if (!member.bannable) return message.reply({ content: `${message.author}, Eu não posso banir esse usuário! Verificar minhas permissões/hierarquia no servidor!` });
        let banReason = 'Não informado';
        let daysDelete = 0
        if (args[1]) {
            let fullArgs = args.join(' ')
            banReason = fullArgs.substring(args[0].length - 1)
            if (fullArgs.includes('|')) {
                daysDelete = parseInt(fullArgs.split('|')[1], 10);
                banReason = fullArgs.substring(args[0].length - 1, (fullArgs.lastIndexOf('|')))
            }
            if (daysDelete > 7) daysDelete = 7
            else if (daysDelete < 0) daysDelete = 0
        }
        const msg = await message.reply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: `${message.author.username}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` })
                    .setDescription(`<:girlfbi:1217187900924625016> Você está prestes a banir "**${user.username} - (ID: ${user.id})**" do servidor! Reaja no botão :white_check_mark: para prosseguir com o banimento.`)
                    .addFields({ name: 'Motivo da punição:', value: `\`${banReason}\`` })
                    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                    .setColor(colors.yellow)
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('confirm')
                            .setEmoji("<:certo:1213102531807416393>")
                            .setLabel("Confirmar")
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId("xexit")
                            .setEmoji("<:Errado:1213102598585057281>")
                            .setLabel("Cancelar")
                            .setStyle(ButtonStyle.Danger)
                    )
            ]
        });
        const collector = await msg.createMessageComponentCollector({ time: 21000 });
        collector.on(`collect`, async (i) => {
            await i.deferUpdate();
            if (i.user.id !== message.author.id) return;
            if (i.customId === 'confirm') {
                collector.stop();
                member.ban({ days: daysDelete, reason: 'Banido por: ' + message.author.id + '\nMotivo: ' + banReason });
                msg.delete().catch(() => { });
                return i.channel.send({ content: `:tada: ${message.author}, O membro foi punido com sucesso.` });
            } else {
                collector.stop();
                msg.delete().catch(() => { });
            }
        });
        collector.on('end', (collection, reason) => {
            if (reason !== "time") return;
            msg.delete().catch(() => { });
        });
    }
}
// autor Mel
