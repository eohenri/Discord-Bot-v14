const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');
const User = require("../../schema/user");
const Guild = require("../../schema/guild");
const colors = require("../../util/colors");
const slotItems = ["🍇", "🍉", "🍊", "🍎", "🍓", "🍒"];
const abreviar = require("../../util/abreviar");

module.exports = {
    name: "slots",
    category: "eco",
    aliases: ["slot"],
    run: async (client, message, args, prefix) => {
        let prefixo = prefix || "s.";
        const data = await User.findById({ _id: message.author.id });
        if (!data) return message.reply({ content: `${message.author}, Você ainda não coletou seu daily.` });
        let money = args[0];
        if (!money) return message.reply({ content: `${message.author}, Você deve utilizar o comando no formato correto: **${prefixo}slots <quantia>**` });
        if (!/^[A-Za-z0-9]+$/.test(money)) return message.reply({ content: `${message.author}, Você não pode usar símbolos no meio de números, quebra de linha.`, ephemeral: true });
        if (money.includes("all")) money = data.economia.ametistas;
        if (["m", "k"].some(text => args[0].toLowerCase().endsWith(text)) === true) money = await abreviar(money);
        if (isNaN(money)) return message.reply({ content: `${message.author}, Você não forneceu um número válido!` })
        if (money < 200 || money > 900) return message.reply({ content: `${message.author}, Você deve apostar somente valores entre 200 a 900 moedas!` })
        let win = false;
        if (!money) return message.reply({ content: `${message.author}, Você deve utilizar o comando no formato: **${prefixo}slots <quantia>**` });
        if (money > data.economia.ametistas) return message.reply({ content: `${message.author}, Você não possui saldo suficiente em mãos!` });
        let number = []
        for (i = 0; i < 3; i++) { number[i] = Math.floor(Math.random() * slotItems.length); }
        if (number[0] == number[1] && number[1] == number[2]) {
            money *= 4
            win = true;
        } else if (number[0] == number[1] || number[0] == number[2] || number[1] == number[2]) {
            money *= 2
            win = true;
        }
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('slots_1')
                    .setLabel(`${slotItems[number[0]]}`)
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId('slots_2')
                    .setLabel(`${slotItems[number[1]]}`)
                    .setStyle(ButtonStyle.Success)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId('slots_3')
                    .setLabel(`${slotItems[number[2]]}`)
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(true)
            );
        if (win) {
            await User.findByIdAndUpdate({ _id: message.author.id }, { $inc: { "economia.ametistas": +money }, });
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({ name: `Slots de ${message.author.username}`, iconURL: `${message.author.displayAvatarURL()}` })
                        .setDescription(`🎰 ${message.author} ganhou **${money.toLocaleString()}** moedas.`)
                        .setColor(colors.green)
                        .setTimestamp()
                ],
                components: [row]
            });
        } else {
            await User.findByIdAndUpdate({ _id: message.author.id }, { $inc: { "economia.ametistas": -money }, });
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({ name: `Slots de ${message.author.username}`, iconURL: `${message.author.displayAvatarURL()}` })
                        .setDescription(`🎰 ${message.author}  perdeu **${money.toLocaleString()}** moedas.`)
                        .setColor(colors.red)
                        .setTimestamp()
                ],
                components: [row]
            });
        }
    }
}
