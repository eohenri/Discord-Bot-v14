const {
    EmbedBuilder
} = require("discord.js");
const colors = require("../../util/colors");
let values = ["pedra", "papel", "tesoura"];
let emojis = ["🪨", "📃", "✂"];

module.exports = {
    name: 'jokenpo',
    category: "fun",
    aliases: ['ppt'],
    run: async (client, message, args) => {
        const sorte = args[0];
        if (!sorte) return message.reply(`<a:Erro:1178773952659726346> › ${message.author}, Você não informou pedra, papel, tesoura.`);
        if (!values.some(x => sorte === x)) return message.reply(`<a:Erro:1178773952659726346> › ${message.author}, Você não informou pedra, papel, tesoura.`);
        let user;
        let bot2;
        if (sorte.includes("pedra") || sorte.includes("rock")) user = 0;
        else if (sorte.includes("papel") || sorte.includes("paper")) user = 1;
        else if (sorte.includes("tesoura") || sorte.includes("scissors")) user = 2;
        else user = Math.floor(Math.random() * 3);
        bot2 = Math.floor(Math.random() * 3);
        let embed = new EmbedBuilder()
            .setTitle("Jan...Ken...Pon!")
            .setFooter({
                text: `by ${message.author.username}`,
                iconURL: message.author.displayAvatarURL({ dynamic: true }),
            });
        let description = ` __Você jogou__: **${values[user]}** ${emojis[user]}\n __Eu joguei__: ||**${values[bot2]}** ${emojis[bot2]}||\n\n`;
        let result = "";
        if (user == bot2) {
            embed.setColor(colors.purble);
            result = `🤝 **Empate**!`;
        } else if (
            (values[user] == "pedra" && values[bot2] == "papel") ||
            (values[user] == "papel" && values[bot2] == "tesoura") ||
            (values[user] == "tesoura" && values[bot2] == "pedra")
        ) {
            embed.setColor(colors.purble);
            result = `:stuck_out_tongue_closed_eyes: **Derrota**!`;
        } else {
            embed.setColor(colors.purble);
            result = `:partying_face: **Vitória**!`;
        }
        if (values[user] == "tesoura" && values[bot2] == "tesoura") {
            embed.setColor(colors.purble);
            result = "✂ Empate ✂\nFoi uma bela partida!";
        }
        embed.setDescription(description + result);
        message.reply({ embeds: [embed] });
    }
}
// autor Mel
//
