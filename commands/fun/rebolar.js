const {
    EmbedBuilder
} = require("discord.js");
const kakashi = require('anime-actions');
const colors = require("../../util/colors");

module.exports = {
    name: 'rebolar',
    category: "fun",
    aliases: ['dance', 'dancar', 'dançar'],
    run: async (client, message, args) => {
        const image = await kakashi.dance();
        message.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`💃 ${message.author} está dançando!`)
                    .setImage(`${image}`)
                    .setColor("#f9829b")
            ]
        });
    }
}
// autor Mel