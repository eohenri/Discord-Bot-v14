const {
    EmbedBuilder
} = require("discord.js");
const User = require("../../schema/user");
const colors = require("../../util/colors");

module.exports = {
    name: "gozofone",
    category: "roleplay",
    aliases: ["gf"],
    run: async (client, message, args) => {
        const userdb = await User.findById({ _id: message.author.id });
        if (!userdb) return message.reply({ content: `${message.author}, Você não coletou o daily hoje!` });
        if (!userdb.casar.casado) return message.reply({ content: `${message.author}, Você não está casado(a)!` });
        if (Date.now() < userdb.cooldowns.gf) return message.reply({ content: `<:cooldown:1214803179183542292> Você poderá ir GF novamente <t:${~~(userdb.cooldowns.gf / 1000)}:R>` });
        const user = await client.users.fetch(userdb.casar.com);
        if (!user) return;
        const porcentagem = Math.round(Math.random() * 100);
        if (porcentagem > 70) {
            const coins = Math.floor(Math.random() * 700) + 1000;
            await User.updateOne({ _id: message.author.id }, { $inc: { "economia.ametistas": coins }, $set: { "cooldowns.gf": Date.now() + 7200000 } });
            message.reply({ content: `<:corretoo:1215267550225637416> ${message.author}, Você praticou 💢 \`GF\` com \`${user.username}\`, e recebeu **${Number(coins).toLocaleString()} moedas**.` });
        } else {
            await User.updateOne({ _id: message.author.id }, { $set: { "cooldowns.gf": Date.now() + 7200000 } });
            message.reply({ content: `<:Erradoo:1215267846016204822> ${message.author}, Você broxou ao tentar praticar 💢 \`GF\` com \`${user.username}\`, e recebeu nenhuma moeda.` });
        }
    }
}
