const Guild = require("../schema/guild");
const Lottery = require("../schema/lottery");
const User = require("../schema/user");

module.exports = async (client) => {
    const dblottery = await Lottery.findOne({ docId: client.user.id });
    if (!dblottery) return;
    if (!dblottery.status) return;
    const channel = client.channels.cache.get("1217496177570873355");
    if (!channel) {
        return await Lottery.updateOne({ docId: client.user.id }, { $set: { "status": false, "users": [] } });
    };
    if (dblottery.users.length < 1) {
        await Lottery.updateOne({ docId: client.user.id }, { $set: { "status": false, "users": [] } });
        return channel.send({ content: ":x: A loteria precisa de mais de um apostador!\n[<@&1236506641386700862>]" });
    };
    if (Date.now() < dblottery.cooldown) return;
    const listAll = dblottery.users;
    const money = Math.floor(listAll.length * 150) + 5000;
    const allEqual = arr => arr.every(val => val === arr[0]);
    if (allEqual(listAll)) {
        await Lottery.updateOne({ docId: client.user.id }, { $set: { "status": false, "users": [] } });
        return channel.send({ content: ":x: A loteria precisa de mais de um apostador!\n[<@&1236506641386700862>]" });
    }
    const winner = listAll[Math.floor(Math.random() * listAll.length)];
    const user = await client.users.fetch(winner);
    if (!user) {
        await Lottery.updateOne({ docId: client.user.id }, { $set: { "status": false, "users": [] } });
        return channel.send({ content: ":x: O usuário não foi encontrado!\n[<@&1236506641386700862>]" });
    }
    channel.send({ content: `# <:b_girlhype:1217471859914965104> Loteria da Sorte!\n\n 💸 O ganhador foi **${user.username}** e recebeu **${money.toLocaleString()} moedas**!\n[<@&1236506641386700862>]` });
    await Lottery.updateOne({ docId: client.user.id }, { $set: { "status": false, "users": [], "winner_old": winner } });
    await User.findByIdAndUpdate({ _id: user.id }, { $inc: { "economia.ametistas": Number(money) } });
}
