const {
    EmbedBuilder
} = require("discord.js");
const kakashi = require('anime-actions');
const colors = require("../../util/colors");

module.exports = {
    name: 'feliz',
    category: "fun",
    aliases: ['happy', 'alegre'],
    run: async (client, message, args) => {
        const image = await kakashi.happy();
        message.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`😊 ${message.author} está feliz!`)
                    .setImage(`${image}`)
                    .setColor("#f9829b")
            ]
        });
    }
}
// autor Mel