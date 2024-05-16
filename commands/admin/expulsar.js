const {
    EmbedBuilder,
    PermissionsBitField,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');
const colors = require("../../util/colors");

module.exports = {
    name: 'expulsar',
    category: "moderation",
    aliases: ['kick'],
    run: async (client, message, args) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) return message.reply({ content: `${message.author}, Você não possui permissão de expulsar membros!` });
        if (!args[0]) return message.reply({ content: `${message.author}, Mencione alguém para a expulsão!` });
        let user = message.mentions.users.first() || client.users.cache.get(args[0]);
        if (user.id === message.author.id) return message.reply({ content: `${message.author}, Você não pode expulsar si mesmo!` });
        if (user.id === client.user.id) return message.reply({ content: `${message.author}, Você não pode me expulsar usando meu próprio comando!` });
        let member = message.guild.members.cache.get(user.id);
        if (!member) return message.reply({ content: `${message.author}, O membro não foi encontrado!` });
        if (!member.kickable) return message.reply({ content: `${message.author}, Eu não posso explsar esse usuário! Verificar minhas permissões/hierarquia no servidor!` });
        const msg = await message.reply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: `${message.author.username}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` })
                    .setDescription(`<:girlfbi:1217187900924625016> Você está prestes a expulsar "**${user.username} - (ID: ${user.id})**" do servidor! Reaja no botão :white_check_mark: para prosseguir com o expulsão.`)
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
                member.kick();
                msg.delete().catch(() => { });
                return i.channel.send({
                    content: `:tada: ${message.author}, O membro foi punido com sucesso.`
                });
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
