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
    name: "tellonym-canal",
    category: "settings",
    aliases: ["settellonym", "tellonym"],
    run: async (client, message, args) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return message.reply({ content: `${message.author}, Você não possui permissão de gerenciar servidor!` });
        const data = await Guild.findById({ _id: message.guild.id });
        if (!data) return;
        const msg = await message.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Tellonym")
                    .setDescription(`<:setta:1217816527013679155> Status: ${data.tellonym.enable ? "<:ligado:1197190648663646339> \`Ligado!\`" : "<:Desligado:1197194094947078288> \`Desligado!\`"}\n<:setta:1217816527013679155> Canal: ${data.tellonym.channel ? `<#${data.tellonym.channel}>` : "Não setado."}`)
                    .setFooter({ text: "Tellonym definir canal de entrega." })
                    .setColor(colors.white)
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("onsystem")
                            .setLabel("Ativar")
                            .setStyle(ButtonStyle.Success)
                            .setDisabled(data.tellonym.enable),
                        new ButtonBuilder()
                            .setCustomId("setchannel")
                            .setLabel("Definir canal")
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId("offsystem")
                            .setLabel("Desativar")
                            .setStyle(ButtonStyle.Danger)
                            .setDisabled(!data.tellonym.enable)
                    )
            ], fetchReply: true
        });
        const collector = await msg.createMessageComponentCollector({ componentType: ComponentType.Button, time: 87000 });
        collector.on('collect', async (i) => {
            await i.deferUpdate();
            if (i.user.id !== message.author.id) return;
            const input = i.customId;
            if (input === "onsystem") {
                if (data.tellonym.channel === undefined) return i.followUp({ content: ":x: Nenhum canal foi configurado para o tellonym!", ephemeral: true });
                collector.stop();
                await Guild.updateOne({ _id: i.guild.id }, { $set: { "tellonym.enable": true } });
                msg.edit({ content: `<a:CERTO:1213127081890938982> **|** ${i.user}, Você ativou o sistema de tellonym com sucesso!`, embeds: [], components: [] });
            } else if (input === "offsystem") {
                collector.stop();
                await Guild.updateOne({ _id: i.guild.id }, { $set: { "tellonym.enable": false } });
                return msg.edit({ content: `<a:CERTO:1213127081890938982> **|** ${i.user}, Você desativou o sistema de tellonym com sucesso!`, embeds: [], components: [] });
            } else if (input === "setchannel") {
                collector.stop();
                const channelMenu = new ChannelSelectMenuBuilder()
                    .setCustomId('selectchannel')
                    .setPlaceholder('Selecione o canal')
                    .setMinValues(1)
                    .setMaxValues(1)
                    .setChannelTypes(ChannelType.GuildText);
                const row2 = new ActionRowBuilder().addComponents(channelMenu);
                const msg2 = await msg.edit({ content: `<a:setar_roxooulilas:1215098342263099393> **|** ${i.user}, Selecione o "**__CANAL DE TEXTO__**" que será usado para enviar mensagens do tellonym:`, embeds: [], components: [row2], fetchReply: true });
                const collector2 = await msg2.createMessageComponentCollector({ time: 32000 });
                collector2.on('collect', async (inter) => {
                    await inter.deferUpdate();
                    if (inter.user.id !== message.author.id) return;
                    const channelId = inter.values[0];
                    await Guild.updateOne({ _id: inter.guild.id }, { $set: { "tellonym.channel": channelId } });
                    msg2.edit({ content: `<a:CERTO:1213127081890938982> **|** ${inter.user}, Você definiu <#${channelId}> para mim para enviar mensagens do tellonym!`, components: [] });
                });
                collector2.on('end', (collection, reason) => {
                    if (reason !== "time") return;
                    msg2.delete().catch(() => { });
                });
            }
        });
        collector.on('end', (collection, reason) => {
            if (reason !== "time") return;
            msg.delete().catch(() => { });
        });
    }
}//
///
