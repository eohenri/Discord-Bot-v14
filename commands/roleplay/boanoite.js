const {
    EmbedBuilder
} = require('discord.js');
const kakashi = require('anime-actions');
const colors = require("../../util/colors");

module.exports = {
    name: 'boanoite',
    category: 'fun',
    dev: false,
    aliases: ['bnoite', 'bn', 'good-night', 'goodnight'],
    run: async (client, message, args) => {
        const user = message.author;
        const img = await kakashi.goodnight();

        const emb = new EmbedBuilder()
        .setTitle(`${user.username} foi mimi..`)
        .setImage(`${img}`)
        message.reply({embeds: [emb]})
    }
}
