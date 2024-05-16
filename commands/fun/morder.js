const {
    EmbedBuilder
} = require("discord.js");
const kakashi = require('anime-actions');
const colors = require("../../util/colors");

module.exports = {
    name: "morder",
    category: "fun",
    aliases: ["bite"],
    run: async (client, message, args) => {
        const user = message.mentions.users.first();
        if (!user) return message.reply(`${message.author}, O usuário não foi encontrado ou mencionado.`);
        const image = await kakashi.bite();
        message.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`🤤 ${message.author.username} mordeu ${user.username}!`)
                    .setImage(`${image}`)
                    .setColor("#f9829b")
            ]
        });
    }
}
//autor Mel
