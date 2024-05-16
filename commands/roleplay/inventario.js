const {
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    ComponentType
} = require("discord.js");
const User = require("../../schema/user");
const colors = require("../../util/colors");

module.exports = {
    name: "inventario",
    category: "roleplay",
    aliases: ["inv"],
    run: async (client, message, args) => {
        const data = await User.findOne({ _id: message.author.id });
        if (!data) return message.reply({ content: `${message.author}, Você deve coletar seu daily antes.` });
        const confirm = new ButtonBuilder()
            .setCustomId('confirm')
            .setLabel('Abrir inventário')
            .setEmoji("<a:bau:1196505946495647824>")
            .setStyle(ButtonStyle.Primary);
        const row = new ActionRowBuilder().addComponents(confirm);
        const msg = await message.reply({ content: `${message.author}, abra seu inventário.`, components: [row], fetchReply: true });
        const collector = msg.createMessageComponentCollector({ componentType: ComponentType.Button, time: 87000 });
        collector.on('collect', async (i) => {
            await i.deferUpdate();
            if (i.user.id !== message.author.id) return;
            await i.followUp({
                embeds: [new EmbedBuilder()
                    .setTitle("Seu inventário.")
                    .setColor(colors.default)
                    .setDescription(`:gun: **|** Arma: x${data.inv.arma}\n:fishing_pole_and_fish: **|** Vara de pesca: x${data.inv.vara}\n:safety_vest: **|** Salva vidas: x${data.inv.colete}\n:pick: **|** Picareta: x${data.inv.picareta}`)
                    .setTimestamp()
                    .setFooter({
                        text: `${message.author.username}`,
                        iconURL: `${message.author.displayAvatarURL()}`
                    })],
                ephemeral: true
            });
        });
        collector.on('end', (collection, reason) => {
            if (reason !== "time") return;
            msg.delete().catch(() => { });
        });
    }
}
