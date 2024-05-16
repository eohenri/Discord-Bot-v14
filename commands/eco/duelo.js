const {
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder
} = require("discord.js");
const User = require("../../schema/user");
const Guild = require("../../schema/guild");
const abreviar = require("../../util/abreviar");
const colors = require("../../util/colors");

module.exports = {
    name: "duelo",
    category: "economy",
    aliases: ["rinha"],
    run: async (client, message, args, prefix) => {
        await message.channel.sendTyping();
        let prefixo = prefix || "s";
        const userdb = await User.findOne({ _id: message.author.id });
        if (!userdb) return message.reply({ content: `${message.author}, Você não coletou o daily hoje!` });
        let valor = args[0];
        if (!valor) return message.reply({ content: `${message.author}, Você deve utilizar no formato:\n\`${prefixo}rinha <quantia>\`` });
        if (!/^[A-Za-z0-9]+$/.test(valor)) return message.reply({ content: `${message.author}, Você deve fornecer apenas números inteiros e positivos.`, ephemeral: true });
        if (valor.includes("all")) valor = userdb.economia.ametistas;
        if (["m", "k"].some(text => args[0].toLowerCase().endsWith(text)) === true) valor = await abreviar(valor);
        if (isNaN(valor)) return message.reply({ content: `${message.author}, Você deve fornecer apenas números inteiros e positivos.` })
        if (userdb.economia.ametistas < valor || valor < 1) return message.reply({ content: `${message.author}, Você não possui saldo suficiente para apostar.` });
        let users = [message.author.id];
        let index = 4;
        const msg = await message.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Rinha de moedas :coin:")
                    .setDescription(`Participe dessa aposta pagando **${valor} moedas** na entrada.`)
                    .setColor(colors.default)
                    .addFields({ name: "👥 Apostadores:", value: `${users.map(u => `<@${u}>`).join(", ")}`, inline: true }, { name: ":dollar: Premiação:", value: `${Number(valor).toLocaleString()} moedas`, inline: true })
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("join")
                            .setLabel(`Entrar (${users.length}/${index})`)
                            .setEmoji("💸")
                            .setStyle(ButtonStyle.Success)
                            .setDisabled(true)
                    )
            ], fetchReply: true
        });
        const collector = await msg.createMessageComponentCollector({ time: 67000 });
        collector.on('end', (collection, reason) => {
            if (reason !== "time") return;
            msg.delete().catch(() => { });
            message.channel.send({ content: `${message.author}, Sua rinha foi cancelada por falta de usuários.` });
        });
    }
}