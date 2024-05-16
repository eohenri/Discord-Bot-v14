const {
    EmbedBuilder
} = require("discord.js");
const User = require("../../schema/user");
const Guild = require("../../schema/guild");
const colors = require("../../util/colors");
const Owners = [
    "1148575199269228655", //Mel
    "797922004920827904",
    "1046838112833253486" //henri
];// Coloque seu ID

module.exports = {
    name: "roleta",
    category: "economy",
    aliases: ["roletarussa"],
    run: async (client, message, args, prefix) => {

        let prefixo = prefix || "s";

        const userdb = await User.findById({ _id: `${message.author.id}` });
        if (!userdb) return message.reply({ content: `${message.author}, Você não coletou o daily hoje!` });

        const sortes = ["morreu", "morreu", "viveu", "morreu", "viveu", "morreu", "morreu", "viveu", "morreu", "morreu"];
        const valor = args[0];
        if (!valor) return message.reply({ content: `${message.author}, Você deve utilizar no formato:\n\`${prefixo}roleta <quantia>\`` });
        if (!/^[A-Za-z0-9]+$/.test(valor)) return message.reply({ content: `${message.author}, Você deve fornecer apenas números inteiros e positivos.` });
        if (isNaN(valor)) return message.reply({ content: `${message.author}, Você deve fornecer apenas números inteiros e positivos.` })
        if (valor < 250 || valor > 800) return message.reply({ content: `${message.author}, A quantia mínima é de **250 gemas** até no máximo **800 gemas**.` });
        if (userdb.economia.ametistas < valor || valor < 1) return message.reply({ content: `${message.author}, Você não possui saldo suficiente para apostar!` });

        //jogo
        const sorteio = sortes[Math.floor(Math.random() * sortes.length)];

        if (sorteio === "viveu") {

            message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("<:GirlGun:1234519732775026829> O que será que aconteceu?")
                        .setColor(colors.white)
                        .setDescription(`Você sobreviveu a roleta e ganhou **<:AMETISTA:1234467310958411858> ${valor} ametistas**!`)
                        .setImage("https://media.discordapp.net/attachments/1184605941170192401/1189642265195458732/15.gif")
                        .setTimestamp()
                        .setFooter({ text: `${message.author.username}`, iconURL: `${message.author.displayAvatarURL()}` })
                ]
            });

            await User.findByIdAndUpdate({ _id: `${message.author.id}` }, { $inc: { "economia.ametistas": valor } });

        } else {

            message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("<:GirlGun:1234519732775026829> O que será que aconteceu?")
                        .setColor("#000000")
                        .setDescription(`Você acabou morrendo levando um tiro e perdeu **<:AMETISTA:1234467310958411858> ${valor} ametistas**!`)
                        .setImage("https://media.discordapp.net/attachments/1184605941170192401/1189642265195458732/15.gif")
                        .setTimestamp()
                        .setFooter({ text: `${message.author.username}`, iconURL: `${message.author.displayAvatarURL()}` })
                ]
            });

            await User.findByIdAndUpdate({ _id: `${message.author.id}` }, { $inc: { "economia.ametistas": -valor } });

        }
    }
}
// dev athena
