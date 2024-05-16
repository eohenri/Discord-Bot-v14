const {
    EmbedBuilder
} = require("discord.js");
const User = require("../../schema/user");
const colors = require("../../util/colors");

module.exports = {
    name: 'dado',
    category: "fun",
    aliases: ['dice', 'rolar'],
    run: async (client, message, args) => {
        let embed = new EmbedBuilder()
            .setAuthor({ name: `${message.author.username}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` })
            .setTitle(':game_die: DADO JOGADO!')
            .setColor(colors.default)
            .setTimestamp()
        let totalResult = 0;
        if (!args[0]) {
            let d1 = Math.random() * 6;
            let result = Math.ceil(d1);
            embed.setDescription(`resultado: ${result}`);
        } else if (args[0] && !args[1]) {
            let d1 = Math.random() * parseInt(args[0], 10);
            if (d1 == NaN) return message.reply({ content: `<a:Erro:1178773952659726346> › ${message.author}, O valor "${args[0]}" do dado é inválido` });
            let result = Math.ceil(d1);
            embed.setDescription(`resultado: ${result}`);
        } else if (args.length > 25) {
            return message.reply({ content: `<a:Erro:1178773952659726346> › ${message.author}, A quantidade máxima de dados para rolar é de 25 dados simultâneos\nO Tamanho máximo possível de todos os dados é 1×10³² ou 1e32 ou 100.000.000.000.000.000.000.000.000.000.000` });
        } else {
            let i = 1;
            for (let arg of args) {
                let dado = parseInt(arg, 10);
                if (dado == NaN || arg.length > 31) return message.reply({ content: `<a:Erro:1178773952659726346> › ${message.author}, O valor "${arg}" do dado N°${a} é inválido` });
                let result = Math.ceil(Math.random() * dado);
                totalResult += result;
                if (totalResult > 1e32)
                    return message.reply({ content: `<a:Erro:1178773952659726346> › ${message.author}, A quantidade máxima de dados para rolar é de 25 dados simultâneos\nO Tamanho máximo possível de todos os dados é 1×10³² ou 1e32 ou 100.000.000.000.000.000.000.000.000.000.000` });
                embed.addFields({ name: `Dado n°${i}`, value: `${result.toString()}` });
                i++
            }

            embed.setDescription(`TOTAL: ${totalResult}`)

        }

        message.reply({ embeds: [embed] })

    }
}
