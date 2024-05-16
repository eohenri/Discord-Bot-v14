const {
    EmbedBuilder
} = require("discord.js");
const User = require("../../schema/user");
const colors = require("../../util/colors");

module.exports = {
    name: "casamento-info",
    category: "roleplay",
    aliases: ["marryinfo"],
    run: async (client, message, args) => {
        const userdb = await User.findById({ _id: message.author.id });
        if (!userdb) return message.reply({ content: `${message.author}, Você não coletou o daily hoje!` });
        if (!userdb.casar.casado) return message.reply({ content: `${message.author}, Você não está casado(a)!` });
        const user = await client.users.fetch(userdb.casar.com);
        if (!user) return;
        message.reply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: `Casamento de ${message.author.username}`, iconURL: `${message.author.displayAvatarURL()}` })
                    .setColor(colors.girl)
                    .setDescription(`:ring: Casado(a) com **${user.username}** <t:${~~(new Date(userdb.casar.tempo) / 1000)}:f> (<t:${~~(new Date(userdb.casar.tempo) / 1000)}:R>)!`)
            ]
        });
    }
}
