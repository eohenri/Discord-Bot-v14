const {
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    ComponentType
} = require("discord.js");
const User = require("../../schema/user");
const Guild = require("../../schema/guild");
const abreviar = require("../../util/abreviar");
const colors = require("../../util/colors");
const emojisOne = ["🐴", "🐭", "🐼", "🐰"];
const emojisTwo = ["🦊", "🐯", "🦃", "🐸"];

module.exports = {
    name: "apostar",
    category: "economy",
    aliases: ["bet"],
    run: async (client, message, args, prefix) => {
        let prefixo = prefix || "s";
        let valor = args[1];
        if (!valor) return message.reply({ content: `${message.author}, Você deve utilizar no formato:\n\`${prefixo}bet @usuário <quantia>\`` });
        if (!/^[A-Za-z0-9]+$/.test(valor)) return message.reply({ content: `${message.author}, Você deve fornecer apenas números inteiros e positivos.` });
        if (["m", "k"].some(text => args[1].toLowerCase().endsWith(text)) === true) valor = await abreviar(valor);
        if (isNaN(valor)) return message.reply({ content: `${message.author}, Você deve fornecer apenas números inteiros e positivos.` })
        const user = message.mentions.users.first();
        if (!user) return message.reply(`${message.author}, Você deve utilizar no formato:\n\`${prefixo}bet @usuário <quantia>\``);
        if (user.id === message.author.id) return message.reply({ content: `${message.author}, Você não pode apostar com si mesmo.`, ephemeral: true });
        if (user.bot) return message.reply({ content: `${message.author}, Você não pode apostar com um bot.`, ephemeral: true });
        const data = await User.findById({ _id: message.author.id });
        if (!data) return message.reply({ content: `${message.author}, Você não coletou o daily hoje!` });
        const data2 = await User.findById({ _id: user.id });
        if (!data2) return message.reply({ content: `${message.author}, Esse usuárionão coletou o daily hoje!` });
        if (data.economia.ametistas < valor || valor < 1) return message.reply({ content: `${message.author}, Você não possui saldo suficiente para a aposta.` });
        if (data2.economia.ametistas < valor) return message.reply({ content: `${message.author}, Usuário mencionado não possui saldo suficiente para a aposta.` });
        const sorteado = Math.round(Math.random() * 100);
        const emoji1 = emojisOne[Math.floor(Math.random() * emojisOne.length)];
        const emoji2 = emojisTwo[Math.floor(Math.random() * emojisTwo.length)];
        const msg = await message.reply({
            content: `:punch: ${user}, ${message.author} deseja apostar com você valendo **${valor.toLocaleString()} gemas**!\n✅ Reaja no botão abaixo para "\`ACEITAR\`" a aposta e arriscar a sorte!\n\nSe vencer ${emoji1}, ${message.author} ganha **${valor.toLocaleString()} gemas**!\nSe vencer ${emoji2}, ${user} ganha **${valor.toLocaleString()} gemas**!`,
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('confirm')
                            .setEmoji("<:certo:1213102531807416393>")
                            .setLabel("Aceitar")
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId("xexit")
                            .setEmoji("<:Errado:1213102598585057281>")
                            .setLabel("Arregar")
                            .setStyle(ButtonStyle.Danger)
                            .setDisabled(false)
                    )
            ],
            fetchReply: true
        });
        const collector = await msg.createMessageComponentCollector({ componentType: ComponentType.Button, time: 47000 });
        collector.on('collect', async (i) => {
            await i.deferUpdate();
            if (i.user.id !== user.id) return;
            if (i.customId === "confirm") {
                collector.stop();
                msg.delete().catch(() => { });
                if (sorteado > 70) {
                    message.channel.send({ content: `# Venceu ${emoji1}!\n:money_with_wings: ${message.author} ganhou **${valor.toLocaleString()} gemas** financiadas por ${user}!` });
                    await User.findByIdAndUpdate({ _id: message.author.id }, { $inc: { "economia.ametistas": valor }, });
                    await User.findByIdAndUpdate({ _id: user.id }, { $inc: { "economia.ametistas": -valor }, });
                    return;
                } else {
                    message.channel.send({ content: `# Venceu ${emoji2}!\n :money_with_wings: ${user} ganhou **${valor.toLocaleString()} gemas** financiadas por ${message.author}!` });
                    await User.findByIdAndUpdate({ _id: message.author.id }, { $inc: { "economia.ametistas": -valor }, });
                    await User.findByIdAndUpdate({ _id: user.id }, { $inc: { "economia.ametistas": valor }, });
                    return;
                }
            } else {
                collector.stop();
                msg.delete().catch(() => { });
            }
        });
        collector.on('end', (collection, reason) => {
            if (reason !== "time") return;
            msg.delete().catch(() => { });
            message.channel.send({ content: `${message.author}, sua tentativa de aposta expirou!` });
        });
    }
}
