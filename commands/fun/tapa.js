const {
    EmbedBuilder
} = require("discord.js");
const kakashi = require('anime-actions');
const colors = require("../../util/colors");

module.exports = {
    name: "tapa",
    category: "fun",
    aliases: ["slap"],
    run: async (client, message, args) => {
        const user = message.mentions.users.first();
        if (!user) return message.reply(`${message.author}, O usuário não foi encontrado ou mencionado.`);
        const image = await kakashi.slap();
        message.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`👋 ${message.author} deu tapas em ${user}!`)
                    .setImage(`${image}`)
                    .setColor("#f9829b")
            ]
        });
    }
}
//autor Mel
