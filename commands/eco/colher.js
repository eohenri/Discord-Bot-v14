const {
    EmbedBuilder,
    ActionRowBuilder,
    ComponentType,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");
const User = require("../../schema/user");
const colors = require("../../util/colors");

module.exports = {
    name: "colher",
    category: "eco",
    aliases: ["colheita", "reap"],
    run: async (client, message, args) => {
        const data = await User.findOne({ _id: message.author.id });
        if (!data) return message.reply({ content: `${message.author}, Você deve primeiro coletar seu daily.` });

        let status = { name: "Nenhuma plantação!", emoji: "❌", enable: true };
        if (Math.floor(data.farm.batata + data.farm.milho + data.farm.arroz + data.farm.feijao + data.farm.cenoura + data.farm.beterraba) > 1) status = { name: "Colher todos os lotes", emoji: "✅", enable: false };
        if (Date.now() < data.cooldowns.colher) status = { name: "Em crescimento!", emoji: "⏰", enable: true };
        const confirm = new ButtonBuilder()
            .setCustomId('colher')
            .setLabel(status.name)
            .setEmoji(status.emoji)
            .setStyle(ButtonStyle.Success).setDisabled(status.enable);
        const valor = Math.floor(Math.random() * 3000) + 5600;
        const row = new ActionRowBuilder().addComponents(confirm);
        const msg = await message.reply({
            embeds: [new EmbedBuilder()
                .setAuthor({
                    name: `${message.author.username}`,
                    iconURL: `${message.author.displayAvatarURL()}`
                })
                .setTitle("Colheita")
                .setColor(colors.yellow)
                .addFields({
                    name: ":potato: | Batata:",
                    value: `Lote: x${data.farm.batata}\nTaxa: 📈 **0.1%**`,
                    inline: true
                }, {
                    name: ":corn: | Milho:",
                    value: `Lote: x${data.farm.milho}\nTaxa: 📈 **0.7%**`,
                    inline: true
                }, {
                    name: ":ear_of_rice: | Arroz:",
                    value: `Lote: x${data.farm.arroz}\nTaxa: 📈 **0.4%**`,
                    inline: true
                }, {
                    name: ":seedling:| Feijão:",
                    value: `Quantidade: x${data.farm.feijao}\nTaxa: 📈 **0.9%**`,
                    inline: true
                }, {
                    name: ":carrot: | Cenoura:",
                    value: `Lote: x${data.farm.cenoura}\nTaxa: 📈 **0.2%**`,
                    inline: true
                }, {
                    name: ":eggplant: | Beterraba:",
                    value: `Lote: x${data.farm.beterraba}\nTaxa: 📈 **0.5%**`,
                    inline: true
                })], components: [row], fetchReply: true
        });
        const collector = await msg.createMessageComponentCollector({ componentType: ComponentType.Button, time: 87000 });
        collector.on('collect', async (i) => {
            await i.deferUpdate();
            if (i.user.id !== message.author.id) return i.followUp({ ephemeral: true, content: ":x: Esse botão não é para vc!" });

            if (Math.floor(data.farm.batata + data.farm.milho + data.farm.arroz + data.farm.feijao + data.farm.cenoura + data.farm.beterraba) < 1) return i.followUp({ ephemeral: true, content: ":x: Não tens plantações para a colheita!" });
            if (Date.now() < data.cooldowns.colher) return i.followUp({ content: `<:AAMIMIR:1179813556640825394> › **${message.author.username}**, Sua plantação se encontra em crescimento, libera <t:${~~(data.cooldowns.colher / 1000)}:R>` });

            collector.stop();
            await msg.edit({
                embeds: [new EmbedBuilder()
                    .setTitle("Colher")
                    .setDescription(`✅ **|** Você colheu todos os lotes e faturou **${valor.toLocaleString()}** gemas + **30** de **XP**!`)
                    .setColor(colors.default)
                    .setTimestamp()
                    .setFooter({ text: `${i.user.username}`, iconURL: `${i.user.displayAvatarURL()}` })
                ], components: []
            });
            await User.findByIdAndUpdate({ _id: i.user.id }, { $inc: { "economia.ametistas": valor, "social.energia": 50 }, $set: { "farm.batata": 0, "farm.milho": 0, "farm.arroz": 0, "farm.feijao": 0, "farm.cenoura": 0, "farm.beterraba": 0 } });
        });
        collector.on('end', (collection, reason) => {
            if (reason !== "time") return;
            msg.delete().catch(() => { });
            message.channel.send({ content: `${message.author}, sua tentativa de colheita expirou!` });
        });
    }
}
