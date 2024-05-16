const {
    EmbedBuilder,
    ActionRowBuilder,
    ComponentType,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder
} = require("discord.js");
const User = require("../../schema/user");
const colors = require("../../util/colors");

module.exports = {
    name: "plantar",
    category: "eco",
    aliases: ["lotes", "plat", "sementes"],
    run: async (client, message, args) => {
        await message.channel.sendTyping();
        const data = await User.findOne({ _id: message.author.id });
        if (!data) return message.reply({ content: `${message.author}, Você deve primeiro coletar seu daily.` });
        const msg = await message.reply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: `${message.author.username}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` })
                    .setTitle(`Fazendinha de ${message.author.username}`)
                    .setColor(colors.white)
                    .setDescription(`▶️ **|** Realize uma nova **plantação de sementes** dos lotes no terreno utilizando o menu de seleção abaixo!`)
                    .setImage("https://media.discordapp.net/attachments/1183517943821258862/1187539158944710787/images_2_7.jpg")],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId("pantl")
                            .setPlaceholder("Selecione um Plantio")
                            .addOptions(
                                new StringSelectMenuOptionBuilder()
                                    .setLabel("Plantar Batata")
                                    .setDescription("Quantidade: x2 | Preço: 1.200")
                                    .setEmoji("🎑")
                                    .setValue("batata"),
                                new StringSelectMenuOptionBuilder()
                                    .setLabel("Plantar Milho")
                                    .setDescription("Quantidade: x1 | Preço: 1.500")
                                    .setEmoji("🎑")
                                    .setValue("milho"),
                                new StringSelectMenuOptionBuilder()
                                    .setLabel("Plantar Arroz")
                                    .setDescription("Quantidade: x3 | Preço: 1.300")
                                    .setEmoji("🎑")
                                    .setValue("arroz"),
                                new StringSelectMenuOptionBuilder()
                                    .setLabel("Plantar Feijao")
                                    .setDescription("Quantidade: x1 | Preço: 1.400")
                                    .setEmoji("🎑")
                                    .setValue("feijao"),
                                new StringSelectMenuOptionBuilder()
                                    .setLabel("Plantar Cenoura")
                                    .setDescription("Quantidade: x3 | Preço: 1.300")
                                    .setEmoji("🎑")
                                    .setValue("cenoura"),
                                new StringSelectMenuOptionBuilder()
                                    .setLabel("Plantar Beterraba")
                                    .setDescription("Quantidade: x4 | Preço: 1.100")
                                    .setEmoji("🎑")
                                    .setValue("beterraba")
                            )
                    )
            ],
            fetchReply: true
        });
        const collector = await msg.createMessageComponentCollector({ time: 76000 });
        collector.on(`collect`, async (i) => {
            if (i.customId === 'pantl') {
                const value = i.values[0];
                if (i.user.id !== message.author.id) return i.deferUpdate();
                collector.stop();
                if (Math.floor(data.farm.batata + data.farm.cenoura + data.farm.beterraba + data.farm.milho + data.farm.arroz + data.farm.feijao) >= 10) {
                    return await i.update({
                        ephemeral: true,
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Mal-sucedida")
                                .setDescription(":x: Você atingiu o limite do seu terreno! Realize uma colheita para liberar seus lotes!")
                                .setColor("#ec5353")
                                .setTimestamp()
                        ], components: []
                    });
                }
                if (value === "batata") {
                    if (data.economia.ametistas < 1200) {
                        return await i.update({
                            ephemeral: true,
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle("Mal-sucedida")
                                    .setDescription(":x: Você não possui saldo suficiente!")
                                    .setColor("#ec5353")
                                    .setTimestamp()
                            ], components: []
                        });
                    }
                    await i.update({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("✨ Plantar")
                                .setDescription(`Você plantou \`x2\` batata e gastou **1,200 gemas**!`)
                                .setColor(colors.default)
                        ], components: []
                    });
                    await User.findByIdAndUpdate({ _id: i.user.id }, { $inc: { "economia.ametistas": -1200, "farm.batata": 2 }, $set: { "cooldowns.colher": Date.now() + 7200000 } });
                }
                if (value === "milho") {
                    if (data.economia.ametistas < 1500) {
                        return await i.update({
                            ephemeral: true,
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle("Mal-sucedida")
                                    .setDescription(":x: Você não possui saldo suficiente!")
                                    .setColor("#ec5353")
                                    .setTimestamp()
                            ], components: []
                        });
                    }
                    await i.update({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("✨ Plantar")
                                .setDescription(`Você plantou \`x1\` milho e gastou **1,500 gemas**!`)
                                .setColor(colors.default)
                        ], components: []
                    });
                    await User.findByIdAndUpdate({ _id: i.user.id }, { $inc: { "economia.ametistas": -1500, "farm.milho": 1 }, $set: { "cooldowns.colher": Date.now() + 7200000 } });
                }
                if (value === "arroz") {
                    if (data.economia.ametistas < 1300) {
                        return await i.update({
                            ephemeral: true,
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle("Mal-sucedida")
                                    .setDescription(":x: Você não possui saldo suficiente!")
                                    .setColor("#ec5353")
                                    .setTimestamp()
                            ], components: []
                        });
                    }
                    await i.update({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("✨ Plantar")
                                .setDescription(`Você plantou \`x3\` arroz e gastou **1,300 gemas**!`)
                                .setColor(colors.white)
                                .setColor(colors.default)
                        ], components: []
                    });
                    await User.findByIdAndUpdate({ _id: i.user.id }, { $inc: { "economia.ametistas": -1300, "farm.arroz": 3 }, $set: { "cooldowns.colher": Date.now() + 7200000 } });
                }
                if (value === "feijao") {
                    if (data.economia.ametistas < 1400) {
                        return await i.update({
                            ephemeral: true,
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle("Mal-sucedida")
                                    .setDescription(":x: Você não possui saldo suficiente!")
                                    .setColor("#ec5353")
                                    .setTimestamp()
                            ], components: []
                        });
                    }
                    await i.update({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("✨ Plantar")
                                .setDescription(`Você plantou \`x1\` feijão e gastou **1,400 gemas**!`)
                                .setColor(colors.default)
                        ], components: []
                    });
                    await User.findByIdAndUpdate({ _id: i.user.id }, { $inc: { "economia.ametistas": -1400, "farm.feijao": 1 }, $set: { "cooldowns.colher": Date.now() + 7200000 } });
                }
                if (value === "cenoura") {
                    if (data.economia.ametistas < 1300) {
                        return await i.update({
                            ephemeral: true,
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle("Mal-sucedida")
                                    .setDescription(":x: Você não possui saldo suficiente!")
                                    .setColor("#ec5353")
                                    .setTimestamp()
                            ], components: []
                        });
                    }
                    await i.update({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("✨ Plantar")
                                .setDescription(`Você plantou \`x3\` cenoura e gastou **1,300 gemas**!`)
                                .setColor(colors.default)
                        ], components: []
                    });
                    await User.findByIdAndUpdate({ _id: i.user.id }, { $inc: { "economia.ametistas": -1300, "farm.cenoura": 3 }, $set: { "cooldowns.colher": Date.now() + 7200000 } });
                }
                if (value === "beterraba") {
                    if (data.economia.ametistas < 1100) {
                        return await i.update({
                            ephemeral: true,
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle("Mal-sucedida")
                                    .setDescription(":x: Você não possui saldo suficiente!")
                                    .setColor("#ec5353")
                                    .setTimestamp()
                            ], components: []
                        });
                    }
                    await i.update({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("✨ Plantar")
                                .setDescription(`Você plantou \`x4\` beterraba e gastou **1,100 gemas**!`)
                                .setColor(colors.default)
                        ], components: []
                    });
                    await User.findByIdAndUpdate({ _id: i.user.id }, { $inc: { "economia.ametistas": -1100, "farm.beterraba": 4 }, $set: { "cooldowns.colher": Date.now() + 7200000 } });
                }
            }
        });
        collector.on('end', (collection, reason) => {
            if (reason !== "time") return;
            msg.delete().catch(() => { });
            message.channel.send({ content: `${message.author}, sua tentativa de plantação expirou!` });
        });
    }
}
