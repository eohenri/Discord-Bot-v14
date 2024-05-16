const {
    EmbedBuilder,
    ActionRowBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    UserSelectMenuBuilder,
    ButtonBuilder,
    ButtonStyle,
    AttachmentBuilder
} = require("discord.js");
const Guild = require("../schema/guild");
const client = require('../index');

client.on("interactionCreate", async (interaction) => {
    if (!interaction.guild || interaction.user.bot) return;
    if (!interaction.isButton()) return;
    if (interaction.customId !== "sendtellonym") return;
    const guilddb = await Guild.findById({ _id: interaction.guild.id });
    if (!guilddb) return;
    if (!guilddb.tellonym.enable) return interaction.reply({ content: ":x: O sistema de tellonym se encontra desativado!", ephemeral: true });
    if (!guilddb.tellonym.channel) return;
    if (Date.now() < guilddb.tellonym.cooldown) return interaction.reply({ content: `:x: Usado recentemente! Aguarde <t:${~~(guilddb.tellonym.cooldown / 1000)}:R> para enviar uma mensagem!`, ephemeral: true });
    const modal = new ModalBuilder()
        .setCustomId("createmsg")
        .setTitle("📬 Tellonym")
    const input = new TextInputBuilder()
        .setCustomId("sendmsginput")
        .setLabel("Enviar mensagem:")
        .setMinLength(10)
        .setMaxLength(850)
        .setPlaceholder("Qual sua mensagem")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);
    const perguntaTxt = new ActionRowBuilder().addComponents(input);
    modal.addComponents(perguntaTxt);
    await interaction.showModal(modal);
    const res = await interaction.awaitModalSubmit({ time: 50000, filter: (i) => i.user.id === interaction.user.id }).catch(() => null);
    if (!res) {
        return;
    } else {
        const { fields } = res;
        const text = fields.getTextInputValue("sendmsginput");
        return res.reply({
            content: `Selecione quem vai receber essa mensagem:`,
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new UserSelectMenuBuilder()
                            .setCustomId('selectuser')
                            .setPlaceholder('Selecione o usuário')
                            .setMinValues(1)
                            .setMaxValues(1))
            ],
            ephemeral: true,
            fetchReply: true
        }).then(inter => {
            const collector = inter.createMessageComponentCollector({ time: 32000 });
            collector.on('collect', async (i) => {
                await i.deferUpdate();
                collector.stop();
                const gdb = await Guild.findById({ _id: i.guild.id });
                if (!gdb) return i.editReply({ content: `:x: Falhas em carregar dados essenciais!`, components: [] });
                const channel = i.guild.channels.cache.get(gdb.tellonym.channel);
                if (!channel) return i.editReply({ content: `:x: O canal de envios não foi encontrado!`, components: [] });
                const id = i.values[0];
                await Guild.updateOne({ _id: i.guild.id }, { $set: { "tellonym.cooldown": Date.now() + 300000 } });
                const file = new AttachmentBuilder('assets/imgs/tellonym.png');
                channel.send({
                    content: `Para <@${id}>`,
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(`${text}`)
                            .setImage("attachment://tellonym.png")
                            .setColor("#2a2d30")
                    ],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId(`tellonym-${i.user.id}`)
                                    .setLabel("tellonym")
                                    .setEmoji("<:Tellonym:1215621601958043718>")
                                    .setStyle(ButtonStyle.Secondary)
                                    .setDisabled(true)
                            )
                    ], files: [file]
                });
                i.editReply({ content: `<a:CERTO:1213127081890938982> **|** ${i.user} sua mensagem foi entregue com sucesso!`, components: [] });
            })
        });
    }
});
// autor Mel
// Proibido compartilhamento 