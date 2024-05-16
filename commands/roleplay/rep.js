const {
    EmbedBuilder
} = require('discord.js');
const User = require("../../schema/user");
const colors = require("../../util/colors");

module.exports = {
    name: "rep",
    category: "roleplay",
    aliases: ["reputação", "reputar", "curte"],
    run: async (client, message, args, prefix) => {
        let prefixo = prefix || "s";
        await message.channel.sendTyping();
        const user = message.mentions.users.first();
        if (!user) return message.reply({ content: `${message.author}, Você deve usar o comando no formato correto:\n\`${prefixo}rep @usuário\`` });
        if (user.id === message.author.id) return message.reply({ content: `${message.author}, Você não pode dar uma reputação a si mesmo!` });
        if (user.bot) return message.reply({ content: `${message.author}, Você não pode dar uma reputação para um bot!`, ephemeral: true });
        // usuário 1
        const userdb = await User.findById({ _id: message.author.id });
        if (!userdb) return message.reply({ content: `${message.author}, Você não coletou o daily hoje!` });
        if (Date.now() < userdb.cooldowns.rep) return message.reply({ content: `<:nysa_cooldown:1217515334924505201> **|** Volte <t:${~~(userdb.cooldowns.rep / 1000)}:R> para dar reputações novamente!` });
        // usuário 2
        const userdb2 = await User.findById({ _id: user.id });
        if (!userdb2) return message.reply({ content: `${message.author}, Esse usuário ainda não coletou o daily.` });
        //
        const time = `<t:${~~((Date.now() + require('ms')('6h')) / 1000)}:R>`;
        //
        message.reply({
            content: `${user}, Você recebeu uma reputação!`,
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: `${message.author.username}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` })
                    .setDescription(`<:REPP:1217435811767779379> Você deu \`+1\` reputação para **${user}**! Sabia que agora ele(a) já possui um total de **${Math.floor(userdb2.social.rep + 1)} reputações** no perfil.`)
                    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                    .setColor(colors.yellow)
                    .setTimestamp()
            ]
        });
        //
        await User.findByIdAndUpdate({ _id: message.author.id }, { $inc: { "social.energia": 40 }, $set: { "cooldowns.rep": Date.now() + 21600000 } });
        await User.findByIdAndUpdate({ _id: user.id }, { $inc: { "social.rep": 1 }, });
    }
}
//dev mel
