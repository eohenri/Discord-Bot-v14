const {
    EmbedBuilder
} = require("discord.js");
const kakashi = require('anime-actions');
const colors = require("../../util/colors");

module.exports = {
    name: 'vermelha',
    category: "fun",
    aliases: ['blush', 'vergonha'],
    run: async (client, message, args) => {
        const image = await kakashi.blush();
        message.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`${message.author} acabou de ficar vermelhinha de vergonha!`)
                    .setImage(`${image}`)
                    .setColor(colors.girl)
                    .setTimestamp()
            ]
        });
    }
}
// autor Mel