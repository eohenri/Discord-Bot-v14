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

module.exports = {
    name: "pagar",
    category: "economy",
    aliases: ["transferir", "pay", "pagamento"],
    run: async (client, message, args, prefix) => {
        let prefixo = prefix || "s";
        let valor = args[1];
        if (!valor) return message.reply({ content: `${message.author}, Você deve utilizar no formato:\n\`${prefix}pagar @usuário <quantia>\`` });
        if (!/^[A-Za-z0-9]+$/.test(valor)) return message.reply({ content: `${message.author}, Você deve fornecer apenas números inteiros e positivos.`, ephemeral: true });
        if (["m", "k"].some(text => args[1].toLowerCase().endsWith(text)) === true) valor = await abreviar(valor);
        if (isNaN(valor)) return message.reply({ content: `${message.author}, Você deve fornecer apenas números inteiros e positivos.` })
        const user = message.mentions.users.first();
        if (!user) return message.reply(`${message.author}, Você deve utilizar no formato:\n\`${prefix}pagar @usuário <quantia>\``);
        if (user.id === message.author.id) return message.reply({ content: `${message.author}, Você não pode enviar pagamentos para si mesmo.`, ephemeral: true });
        if (user.bot) return message.reply({ content: `${message.author}, Você não pode enviar pagamentos para bots!`, ephemeral: true });
        const data = await User.findOne({ _id: message.author.id });
        if (!data) return message.reply({ content: `${message.author}, Você não coletou o daily hoje!` });
        const data2 = await User.findById({ _id: user.id });
        if (!data2) return message.reply({ content: `${message.author}, Esse usuário não coletou o daily hoje!` });
        if (data.economia.ametistas < valor || valor < 1) return message.reply({ content: `${message.author}, Você não possui saldo suficiente para pagar o usuário.` });
        const msg = await message.reply({
            content: `💸 ${user}, ${message.author} deseja lhe enviar **${valor.toLocaleString()} moedas**!\n✅ Reaja no botão abaixo para "\`CONFIRMAR\`" essa transação!\n\n<:police_girl:1214888916860141568> **AVISO**: Vender moedas ou trocá-las com coisas que valem dinheiro real como (nitro, pix, etc..) irá resultar em seu banimento!`,
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
                            .setLabel("Recusar")
                            .setStyle(ButtonStyle.Danger)
                            .setDisabled(false)
                    )
            ],
            fetchReply: true
        });
        const collector = await msg.createMessageComponentCollector({ componentType: ComponentType.Button, time: 67000 });
        collector.on('collect', async (i) => {
            await i.deferUpdate();
            if (i.user.id !== user.id) return i.followUp({ ephemeral: true, content: ":x: Esse botão não é para vc!" });
            if (i.customId === "confirm") {
                collector.stop();
                msg.delete().catch(() => { });
                message.channel.send({ content: `✅ ${message.author}, A transacão foi realizada com sucesso!\n${i.user}, Você recebeu **${valor.toLocaleString()} moedas**.` });
                await User.findByIdAndUpdate({ _id: message.author.id }, { $inc: { "economia.ametistas": -valor }, });
                await User.findByIdAndUpdate({ _id: user.id }, { $inc: { "economia.ametistas": valor }, });
            } else {
                collector.stop();
                msg.delete().catch(() => { });
            }
        });
        collector.on('end', (collection, reason) => {
            if (reason !== "time") return;
            msg.delete().catch(() => { });
            message.channel.send({ content: `${message.author}, sua tentativa de pagamento expirou!` });
        });
    }
}
