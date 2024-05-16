const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");
const colors = require("../../util/colors");
const emoji = require("../../util/emotes")

module.exports = {
    name: 'convite',
    category: "app",
    aliases: ['invite', 'addgaby'],
    run: async (client, message, args) => {
        message.reply({ embeds: [new EmbedBuilder().setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
        .setDescription(` ${emoji.happy} **Ebaa**, deseja me adicionar no seu servidor? Saiba que ficarei deverás agradecida em conhecer sua comunidade/amigos e levar divisão a eles!\n\n${emoji.seta_roxa} Clique **[aqui](https://discord.com/oauth2/authorize?client_id=1108562673899143168&scope=bot%20applications.commands&permissions=2146958847)** para convidar a bot.`).setColor(colors.default).setThumbnail(client.user.displayAvatarURL())] });
    }
}//mel
