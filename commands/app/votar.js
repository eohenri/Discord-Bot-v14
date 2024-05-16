const {
    EmbedBuilder
} = require("discord.js");
const Topgg = require("@top-gg/sdk");
const User = require("../../schema/user");
const colors = require("../../util/colors");

module.exports = {
    name: 'vote',
    category: "app",
    aliases: ['votar', 'btl', 'topgg'],
    run: async (client, message, args, prefix) => {
        let p = prefix || "s";
        const userdb = await User.findOne({ _id: message.author.id });
        if (!userdb) return message.reply({ content: `${message.author}, Você não coletou o daily hoje!` });
        if (Date.now() < userdb.cooldowns.topgg) return message.reply({ content: `<:nysa_cooldown:1217515334924505201> **|** Volte <t:${~~(userdb.cooldowns.topgg / 1000)}:R> para votar em mim novamente!` });
        const api = new Topgg.Api("YOU_TOKEN_TOPGG");
        let votou = await api.hasVoted(`${message.author.id}`).catch(() => null);
        if (!votou) return message.reply({ content: `<:presente:1218187435620434010> ${message.author}, Você não votou em mim hoje!\nVotando em mim lhe darei uma recompensa de **10.000 gemas**!\n\nhttps://top.gg/bot/1108562673899143168/vote` });
        message.reply({ embeds: [ new EmbedBuilder().setTitle("✅ Votar").setColor(colors.white).setThumbnail("https://cdn-icons-png.flaticon.com/512/4213/4213958.png").setDescription(`Você **votou em mim** e como recompensa ganhou **<:gemas:1226215346743279616> 10,000 gemas**.`).setFooter({ text: `Utilize ${p}tempo para mostrar seus intervalos!` }) ] });
        await User.updateOne({ _id: message.author.id }, { $inc: { "economia.ametistas": 5000 }, $set: { "cooldowns.topgg": Date.now() + 43200000 } });
    }
}//
