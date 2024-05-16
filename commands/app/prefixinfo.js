const {
    EmbedBuilder
} = require("discord.js");
const Guild = require("../../schema/guild.js");
const colors = require("../../util/colors.js");
const emoji = require("../../util/emotes.js");

module.exports = {
    name: 'prefix info',
    category: 'app',
    aliases: ['pi', 'info prefix', 'prefixinfo'],
    run: async (client, message) => {
        let data = await Guild.findById({ _id: message.guild.id });
        if (!data) {
            const db = new Guild({ _id: message.guild.id, });
            await db.save();
            data = await Guild.findById({ _id: message.guild.id });
        }
        const prefix = data.prefix;
        message.reply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
                    .setDescription(`<:setta:1217816527013679155>  Meu prefixo nesse servidor é \`${prefix}\``)
                    .addFields({ name: "Prefixos globais:", value: "\`Gaby\`, \`star\`, \`Star Gaby\`" })
                    .setFooter({ text: `Use "${prefix}setprefix" para alterar o prefixo atual!` })
                    .setColor(colors.white)
            ]
        })
    }
}
