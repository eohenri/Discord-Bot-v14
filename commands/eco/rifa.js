const {
    EmbedBuilder
} = require("discord.js");
const User = require("../../schema/user");
const Lottery = require("../../schema/lottery");
const abreviar = require("../../util/abreviar");
const colors = require("../../util/colors");

module.exports = {
    name: "rifa",
    category: "economy",
    aliases: ['bilhete'],
    run: async (client, message, args, prefix) => {
        let prefixo = prefix || "s";
        await message.channel.sendTyping();
        let dblottery = await Lottery.findOne({ docId: client.user.id });
        if (!dblottery) {
            const db = new Lottery({ docId: client.user.id });
            await db.save();
            dblottery = await Lottery.findOne({ docId: client.user.id });
        }
        const userdb = await User.findOne({ _id: message.author.id });
        if (!userdb) return message.reply({ content: `${message.author}, Você não coletou o daily hoje!` });
        if (userdb.economia.ametistas < 200) return message.reply({ content: `${message.author}, Você não possui saldo suficiente em mãos!` });
        let userTickets = 0;
        await dblottery.users.forEach(user => { if (user == message.author.id) userTickets++ });
        if (userTickets >= 30) return message.reply({ content: `${message.author}, Você já comprou 30 tickets da rifa hoje! Não é possível adquirir mais tickets!` });
        message.reply({ content: `✅ ${message.author}, Você comprou 🎫 \`(+1) ticket\` na minha rifa no total de **200 gemas**.\n🏆 Confira o resultado do sorteio utilizando **${prefixo}loteria** e no meu servidor oficial.` })
        await User.updateOne({ _id: message.author.id }, { $inc: { "economia.ametistas": -200 } });
        if (dblottery.status) {
            await Lottery.updateOne({ docId: client.user.id }, { $push: { "users": message.author.id } });
        } else {
            await Lottery.updateOne({ docId: client.user.id }, { $set: { "status": true, "cooldown": Date.now() + 7200000 }, $push: { "users": message.author.id } });
        }
    }

}//
