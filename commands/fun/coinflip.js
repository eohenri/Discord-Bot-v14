const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    componentType
} = require("discord.js");
const User = require("../../schema/user");
const Guild = require("../../schema/guild");
const abreviar = require("../../util/abreviar");
const colors = require("../../util/colors");

module.exports = {
    name: "coinflip-bet",
    aliases: ["caraoucoroa", "coinflip"],
    dev: false,
    run: async (client, message, args, prefix = "..") => {
        let prefixo = prefix || "s";
        const userdb = await User.findOne({ _id: message.author.id });
        if (!userdb) return message.reply({ content: `${message.author}, Você não coletou o daily hoje!` });
        const valor = args[1];
        if (!valor) return message.reply({ content: `${message.author}, Você deve utilizar o comando no formato correto:\n\`${prefixo}coinflip @usuario <quantia>\`` });
        if (!/^[A-Za-z0-9]+$/.test(valor)) return message.reply({ content: `${message.author}, Você deve usar somente números inteiros para a quantia da aposta!`, ephemeral: true });
        if (isNaN(valor)) return message.reply({ content: `${message.author}, Você forneceu tudo menos um número inteiro!` })
        if (valor < 300 || valor > 900) return message.reply({ content: `${message.author}, Somente quantias entre 300 a 900 são aceitas!` });
        if (userdb.economia.ametistas < valor || valor < 1) return message.reply({ content: `${message.author}, Você não possui saldo suficiente!` });
        //
        const user = message.mentions.users.first();
        if (!user) return message.reply(`${message.author}, Você deve utilizar o comando no formato correto:\n\`${prefixo}coinflip @usuario <quantia>\``);
        if (user.id === message.author.id) return message.reply({ content: `${message.author}, Você não pode apostar com si mesmo!` });
        if (user.bot) return message.reply({ content: `${message.author}, Você não pode apostar com um bot!`, ephemeral: true });
        const userdb2 = await User.findById({ _id: user.id });
        if (!userdb2) return message.reply({ content: `${message.author}, Esse usuário deve coletar o daily antes.` });
        if (userdb2.economia.ametistas < valor) return message.reply({ content: `${message.author}, Usuário mencionado não possui essa quantia para apostar!` });
        const sorteado = Math.round(Math.random() * 100);
        //msg
        const msg = await message.reply({
            content: `${user}, ${message.author} lhe desafiou no cara ou coroa valendo **${valor.toLocaleString()} moedas**!\n✅ Reaja no botão abaixo para "\`ACEITAR\`" essa aposta e arriscar a sorte!\n\nSe cair :coin: **CARA**, ${message.author} ganha **${valor.toLocaleString()} moedas**!\nSe cair :crown: **COROA**, ${user} ganha **${valor.toLocaleString()} moedas**!`,
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
        const collector = await msg.createMessageComponentCollector({ time: 47000 });
        collector.on('collect', async (i) => {
            await i.deferUpdate();
            if (i.user.id !== user.id) return;
            if (i.customId === "confirm") {
                collector.stop();
                msg.delete().catch(() => { });
                if (sorteado > 70) {
                    message.channel.send({ content: `# 🪙 **CARA**!\n:money_with_wings: ${message.author} ganhou **${valor.toLocaleString()} moedas** financiadas por ${user}!` });
                    await User.findByIdAndUpdate({ _id: message.author.id }, { $inc: { "economia.ametistas": valor }, });
                    await User.findByIdAndUpdate({ _id: user.id }, { $inc: { "economia.ametistas": -valor }, });
                    return;
                } else {
                    message.channel.send({ content: `# 🪙 **COROA**!\n :money_with_wings: ${user} ganhou **${valor.toLocaleString()} moedas** financiadas por ${message.author}!` });
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
// autor Mel
