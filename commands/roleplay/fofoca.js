const {
    EmbedBuilder
} = require("discord.js");
const User = require("../../schema/user");
const colors = require("../../util/colors");

module.exports = {
    name: "fofoca",
    category: "roleplay",
    aliases: ["fofocar"],
    run: async (client, message, args) => {
        const userdb = await User.findById({ _id: message.author.id });
        if (!userdb) return message.reply({ content: `${message.author}, Você não coletou o daily hoje!` });
        if (!userdb.social.friend) return message.reply({ content: `${message.author}, Você não possui um(a) melhor amigo(a) para ouvir suas fofocas.` });
        if (Date.now() < userdb.cooldowns.fofoca) return message.reply({ content: `<:cooldown:1214803179183542292> Você poderá fofocar novamente <t:${~~(userdb.cooldowns.fofoca / 1000)}:R>` });
        const user = await client.users.fetch(userdb.social.friend);
        if (!user) return;
        const porcentagem = Math.round(Math.random() * 100);
        if (porcentagem > 70) {
            const coins = Math.floor(Math.random() * 700) + 1000;
            await User.updateOne({ _id: message.author.id }, { $inc: { "economia.ametistas": coins }, $set: { "cooldowns.fofoca": Date.now() + 7200000 } });
            message.reply({ content: `<:corretoo:1215267550225637416> ${message.author}, Você contou uma fofoca para seu melhor amigo(a) \`${user.username}\` e recebeu **${Number(coins).toLocaleString()} gemas**.` });
        } else {
            await User.updateOne({ _id: message.author.id }, { $set: { "cooldowns.fofoca": Date.now() + 7200000 } });
            message.reply({ content: `<:Erradoo:1215267846016204822> ${message.author}, Você tentou contar uma fofoca para seu melhor amigo(a) \`${user.username}\` que ele(a) já sabia, e recebeu as gemas.` });
        }
    }
}
