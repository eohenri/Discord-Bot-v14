const {
    EmbedBuilder
} = require("discord.js");
const colors = require("../../util/colors");
const emoji = require("../../util/emotes")

module.exports = {
    name: 'ping',
    category: "app",
    aliases: ['latencia', 'ms', 'p'],
    run: async (client, message, args) => {
        message.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Minha - Latência! 🏓")
                    .setDescription(`🗨 **|** Mensagens: \`${client.ws.ping}ms\`\n📡 **|** Gateway: \`${Date.now() - message.createdTimestamp}ms\``)
                    .setColor(colors.default)
            ]
        });
    }
}
