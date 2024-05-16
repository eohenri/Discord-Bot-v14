const {
    EmbedBuilder,
    PermissionsBitField,
    ChannelSelectMenuBuilder,
    ChannelType,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType
} = require('discord.js');
const Guild = require("../../schema/guild");
const colors = require("../../util/colors");

module.exports = {
    name: "setup-tellonym",
    category: "settings",
    aliases: ["paineltellonym", "addtellonym"],
    run: async (client, message, args) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return message.reply({ content: `${message.author}, Você não possui permissão de gerenciar servidor!` });
        const data = await Guild.findById({ _id: message.guild.id });
        if (!data) return;
        if (!data.tellonym.channel) return message.reply({ content: `${message.author}, Nenhum canal de envios foi configurado!` });
        message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Tellonym <:Tellonym:1215621601958043718>")
                    .setDescription(`Enviar uma nova mensagem ou texto para uma pessoa que você ama ou odeia de forma anônima.`)
                    .setColor("#ff0057")
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('sendtellonym')
                            .setLabel("Enviar tellonym")
                            .setStyle(ButtonStyle.Secondary),
                    )
            ],
            fetchReply: true
        });
    }
}
