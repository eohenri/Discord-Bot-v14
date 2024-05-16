const {
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    EmbedBuilder,
    codeBlock,
    ActionRowBuilder
} = require('discord.js');
const Guild = require("../../schema/guild");
const colors = require("../../util/colors");
const emojis = require("../../util/emotes.js")

module.exports = {
    name: 'ajuda',
    category: "app",
    aliases: ['help', 'comandos'],
    run: async (client, message, args) => {
        let data = await Guild.findOne({ _id: message.guild.id }); // Puxa a data do servidor;
        if (!data) {
            const db = new Guild({ _id: message.guild.id, });
            await db.save(); // Se não houver data, ele cria uma nova e salva o prefixo padrão;
            data = await Guild.findOne({ _id: message.guild.id });
        }
        const actionrow = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId("slcid")
                    .setPlaceholder("Selecione uma Categoria")
                    .addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel("Economia")
                            .setEmoji("<:apostar:1183912716520411156>")
                            .setValue("economia"),
                        new StringSelectMenuOptionBuilder()
                            .setLabel("Moderação")
                            .setEmoji("<:mod:1183793256505544754>")
                            .setValue("moderação"),
                        new StringSelectMenuOptionBuilder()
                            .setLabel("Configurações")
                            .setEmoji("<:config:1218653164715380927>")
                            .setValue("configuração"),
                        new StringSelectMenuOptionBuilder()
                            .setLabel("Diversão")
                            .setEmoji("<:tada1:1183792979736010923>")
                            .setValue("diversão"),
                        new StringSelectMenuOptionBuilder()
                            .setLabel("Discord")
                            .setEmoji("<:discord:1184115033563738195>")
                            .setValue("social"),
                        new StringSelectMenuOptionBuilder()
                            .setLabel("Star Gaby")
                            .setEmoji("<:2pink_bot:1218654723947757648>")
                            .setValue("sg"),
                        new StringSelectMenuOptionBuilder()
                            .setLabel("Roleplay")
                            .setEmoji("<:RPG:1218654364667871393>")
                            .setValue("rpg")
                    ));
        const prefix = data.prefix;
        const msg = await message.reply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: "Painel de Ajuda", iconURL: `${client.user.displayAvatarURL({ dynamic: true })}` })
                    .setDescription(`**Olá**, sou a **${client.user.username}** uma bot multifuncional com diversos comandos e funcionalidades divertidas para seu servidor!\n\n<:setta:1217816527013679155> Meu prefixo nesse servidor é \`${prefix}\` para trocá-lo utilize \`${prefix}setprefix\`.`)
                    .setColor(colors.white)
            ],
            components: [actionrow]
        });

        const collector = await msg.createMessageComponentCollector({ time: 36000 })

        collector.on(`collect`, async (i) => {
            if (i.customId === 'slcid') {
                const value = i.values[0];
                if (i.user.id !== message.author.id) {
                    return await i.reply({ content: `<:cross:1141152600230723704> - Somente ${interaction.user.tag} pode interagir com o menu de seleção!`, ephemeral: true })
                }
                if (value === "inicio") {
                    await i.update({ embeds: [embed], components: [actionrow] })
                }
                if (value === "moderação") {
                    await i.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({ name: `${client.user.username} - Comandos`, iconURL: `${client.user.displayAvatarURL({ dynamic: true })}` })
                                .setTitle("<:setta:1217816527013679155> Categoria: Moderação")
                                .setDescription(`${codeBlock("js", client.comandos.filter(c => c.category === "moderation").map(x => `${prefix}${x.name}`).join("\n"))}`)
                                .setColor(colors.white)
                        ], components: [actionrow]
                    });
                }

                if (value === "configuração") {
                    await i.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({ name: `${client.user.username} - Comandos`, iconURL: `${client.user.displayAvatarURL({ dynamic: true })}` })
                                .setTitle("<:setta:1217816527013679155> Categoria: Configuração")
                                .setDescription(`${codeBlock("js", client.comandos.filter(c => c.category === "settings").map(x => `${prefix}${x.name}`).join("\n"))}`)
                                .setColor(colors.white)
                        ], components: [actionrow]
                    });
                }
                if (value === "diversão") {
                    await i.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({ name: `${client.user.username} - Comandos`, iconURL: `${client.user.displayAvatarURL({ dynamic: true })}` })
                                .setTitle("<:setta:1217816527013679155> Categoria: Diversão")
                                .setDescription(`${codeBlock("js", client.comandos.filter(c => c.category === "fun").map(x => `${prefix}${x.name}`).join("\n"))}`)
                                .setColor(colors.white)
                        ], components: [actionrow]
                    });
                }
                if (value === "economia") {
                    await i.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({ name: `${client.user.username} - Comandos`, iconURL: `${client.user.displayAvatarURL({ dynamic: true })}` })
                                .setTitle("<:setta:1217816527013679155> Categoria: Economia")
                                .setDescription(`${codeBlock("js", client.comandos.filter(c => c.category === "economy").map(x => `${prefix}${x.name}`).join("\n"))}`)
                                .setColor(colors.white)
                        ], components: [actionrow]
                    });
                }
                if (value === "social") {
                    await i.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({ name: `${client.user.username} - Comandos`, iconURL: `${client.user.displayAvatarURL({ dynamic: true })}` })
                                .setTitle("<:setta:1217816527013679155> Categoria: Discord")
                                .setDescription(`${codeBlock("js", client.comandos.filter(c => c.category === "discord").map(x => `${prefix}${x.name}`).join("\n"))}`)
                                .setColor(colors.white)
                        ], components: [actionrow]
                    });
                }
                if (value === "sg") {
                    await i.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({ name: `${client.user.username} - Comandos`, iconURL: `${client.user.displayAvatarURL({ dynamic: true })}` })
                                .setTitle("<:setta:1217816527013679155> Categoria: StarGaby")
                                .setDescription(`${codeBlock("js", client.comandos.filter(c => c.category === "app").map(x => `${prefix}${x.name}`).join("\n"))}`)
                                .setColor(colors.white)
                        ], components: [actionrow]
                    });
                }
                if (value === "rpg") {
                    await i.update({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({ name: `${client.user.username} - Comandos`, iconURL: `${client.user.displayAvatarURL({ dynamic: true })}` })
                                .setTitle("<:setta:1217816527013679155> Categoria: Roleplay")
                                .setDescription(`${codeBlock("js", client.comandos.filter(c => c.category === "roleplay").map(x => `${prefix}${x.name}`).join("\n"))}`)
                                .setColor(colors.white)
                        ], components: [actionrow]
                    })
                }
            }
        });
        collector.on('end', (collection, reason) => {
            if (reason !== "time") return;
            msg.delete().catch(() => { });
        });
    }
}
