const {
    EmbedBuilder
} = require("discord.js");
const kakashi = require('anime-actions');
const colors = require("../../util/colors");

module.exports = {
    name: "beijar",
    category: "fun",
    aliases: ["kiss"],
    run: async (client, message, args) => {
        const user = message.mentions.users.first();
        if (!user) return message.reply(`${message.author}, O usuário não foi encontrado ou mencionado.`);
        const image = await kakashi.kiss();
        message.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`${message.author} deu um beijinho em ${user}!`)
                    .setImage(`${image}`)
                    .setColor(colors.girl)
                    .setTimestamp()
            ]
        });
    }
}
// autor Mel