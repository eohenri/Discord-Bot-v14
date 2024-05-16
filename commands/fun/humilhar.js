const {
    EmbedBuilder
} = require("discord.js");
const kakashi = require('anime-actions');
const colors = require("../../util/colors");

module.exports = {
    name: 'humilhar',
    category: "fun",
    aliases: ['zoar', 'bully', "zuar"],
    run: async (client, message, args) => {
        const user = message.mentions.users.first();
        if (!user) return message.reply(`${message.author}, O usuário não foi encontrado ou mencionado.`);
        const image = await kakashi.bully();
        message.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`🥺 ${user} foi humilhado(a) por ${message.author}!`)
                    .setImage(`${image}`)
                    .setColor("#f9829b")
            ]
        });
    }
}
// autor Mel