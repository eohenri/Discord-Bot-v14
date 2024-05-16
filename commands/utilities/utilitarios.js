const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');
const User = require("../../schema/user");
const colors = require("../../util/colors");
const oneShop = require("../../util/sessionone");
const twoShop = require("../../util/sessiontwo");
const threeShop = require("../../util/sessionthree");
const fourShop = require("../../util/sessionfour");

module.exports = {
    name: "loja",
    category: "shop",
    aliases: ["shop"],
    run: async (client, message, args) => {
        const data = await User.findById({ _id: message.author.id });
        if (!data) return message.reply({ content: `${message.author}, Você deve primeiro coletar seu daily.` });
        const msg = await message.reply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({
                        name: `${message.author.username}`,
                        iconURL: `${message.author.displayAvatarURL()}`
                    })
                    .setTitle("Shopping")
                    .setDescription("Veja abaixo minha loja de itens para seu invetário.")
                    .setColor(colors.default)
                    .addFields({
                        name: ":axe: | Ferramentas",
                        value: "Compre ferramentas de trabalho"
                    }, {
                        name: ":gun: | Armamento",
                        value: "Compre armas e munições"
                    }, {
                        name: "🍖 | Comida",
                        value: "Compre alimentos"
                    }, {
                        name: "🌱 | Sementes",
                        value: "Compre sementes para plantar"
                    })
                    .setTimestamp()],
            components: [
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('sessionone')
                        .setEmoji("🪓")
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('sessiontwo')
                        .setEmoji("🔫")
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('sessionthree')
                        .setEmoji("🍖")
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('sessionfour')
                        .setEmoji("🌱")
                        .setStyle(ButtonStyle.Primary)
                )
            ]
        });
        const collector = await msg.createMessageComponentCollector({ time: 76000 });
        collector.on(`collect`, async (i) => {
            await i.deferUpdate();
            if (i.user.id !== message.author.id) return;
            const input = i.customId;
            collector.stop();
            if (input === "sessionone") {
                return oneShop(client, msg, i);
            } else if (input === "sessiontwo") {
                return twoShop(client, msg, i);
            } else if (input === "sessionthree") {
                return threeShop(client, msg, i);
            } else if (input === "sessionfour") {
                return fourShop(client, msg, i);
            }
        });
        collector.on('end', (collection, reason) => {
            if (reason !== "time") return;
            msg.delete().catch(() => { });
        });
    }
}
