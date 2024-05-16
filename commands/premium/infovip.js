const {
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder
} = require("discord.js")
const User = require("../../schema/user");
const colors = require("../../util/colors");
const emoji = require("../../util/emotes");

module.exports = {
    name: 'vip',
    category: 'beta',
    aliases: ['vi', 'info'],
    run: async (client, message, args) => {
if (args[0] === "vip", "info", "visualizar") {
        await message.channel.sendTyping();
    let user = message.mentions.users.first() || message.author;
    if (!user) return message.reply(`${message.author}, O usuário não foi encontrado.`);
    let userdb = await User.findById({ _id: user.id });
    if (!userdb) {
    const createUser = new User({ _id: user.id });
    await createUser.save();
    userdb = await User.findById({ _id: user.id });
    }
    let vipst = userdb.premium.vip;
    let viptm = userdb.premium.viptime;
    if (!vipst) return message.reply({
        content: `${emoji.errado} | O usuário ${user.username} não possui um vip ativo em sua conta atualmente!`,
        components: [
            new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setLabel("Comprar vip")
                .setEmoji("💎")
                .setURL("https://discord.gg/MSe5YKsrhF")
                .setStyle(ButtonStyle.Link)
            )
        ]
    })
    const emb = new EmbedBuilder()
    .setTitle(`${emoji.fofinha} | Status vip:`)
    .setColor(colors.purble)
    .addFields({
        name: `${emoji.vipstar} | Vip atual:`,
        value: '⭢ 🌟Vip Star'
    }, {
        name: `${emoji.cd} | Acabará em:`,
        value: `⭢ <t:${~~(viptm / 1000)}:R>`
    })
    .setThumbnail(user.displayAvatarURL({ dyncamic: true }))
            .setTimestamp();
        return message.reply({ embeds: [emb] });
}
    }
      }
