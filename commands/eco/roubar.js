const {
    EmbedBuilder
} = require("discord.js");
const User = require("../../schema/user");
const Guild = require("../../schema/guild");
const colors = require("../../util/colors");

module.exports = {
    name: "roubar",
    category: "economy",
    aliases: ["roubo", "rob", "assalto", "rob", "steal"],
    run: async (client, message, args, prefix) => {
        let prefixo = prefix || "s";
        const user = message.mentions.users.first();
        const valor = Math.floor(Math.random() * 1500) + 3500;
        if (!user) return message.reply({ content: `${message.author}, Você deve utilizar no formato: \`${prefixo}steal @usuário\`` });
        if (user.id === message.author.id) return message.reply({ content: `${message.author}, Você não pode roubar si mesmo.` });
        if (user.bot) return message.reply({ content: `${message.author}, Você não pode roubar um bot.` });
        const userdb = await User.findOne({ _id: message.author.id });
        if (!userdb) return message.reply({ content: `${message.author}, Você não coletou o daily hoje!` });
        const userdb2 = await User.findById({ _id: user.id });
        if (!userdb2) return message.reply({ content: `${message.author}, O usuário não coletou o daily hoje!` });
        if (Date.now() < userdb.cooldowns.assalto) return message.reply({ content: `<:cooldown:1214803179183542292> Você poderá roubar novamente <t:${~~(userdb.cooldowns.assalto / 1000)}:R>` });
        if (userdb2.economia.ametistas < valor) return message.reply({ content: `${message.author}, Você não pode roubar uma vitima com saldo abaixo de **${valor} moedas**.` });
        if (userdb.social.energia < 150) return message.reply({ content: `${message.author}, Você deve possuir no minimo **150'XP** para cometer crimes ou roubos.` });
        message.reply({
            content: `${user}`,
            embeds: [
                new EmbedBuilder()
                    .setTitle(`${user.username} foi assaltado(a) sem chances de defesa. <:corretoo:1215267550225637416>`)
                    .setDescription(`Você assaltou ${user} e roubou **${valor} moedas** dele(a) e gastou **90** de **XP**!`)
                    .setTimestamp()
                    .setColor(colors.yellow)
                    .setFooter({ text: `${message.author.username}`, iconURL: `${message.author.displayAvatarURL()}` })
            ]
        });
        await User.findByIdAndUpdate({ _id: message.author.id }, { $inc: { "economia.ametistas": valor, "social.energia": -90 }, $set: { "cooldowns.assalto": Date.now() + 86400000 } });
        await User.findByIdAndUpdate({ _id: user.id }, { $inc: { "economia.ametistas": -valor }, });
    }
}
