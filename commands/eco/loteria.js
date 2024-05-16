const {
    EmbedBuilder
} = require("discord.js");
const Lottery = require("../../schema/lottery");
const colors = require("../../util/colors");

module.exports = {
    name: "loteria",
    category: "economy",
    aliases: ["loteriainfo", "megasena", "raspadinha"],
    run: async (client, message, args, prefix) => {
        let prefixo = prefix || "s";
        let dblottery = await Lottery.findOne({ docId: client.user.id });
        if (!dblottery) {
            const criar = new Lottery({ docId: client.user.id });
            await criar.save();
            dblottery = await Lottery.findOne({ docId: client.user.id });
        };
        const jogadores = dblottery.users.length;
        const ultimoGanhador = await client.users.fetch(dblottery.winner_old);
        let userTickets = 0;
        let vitoriaPercent = 0;
        let money = 0;
        let date = dblottery.status ? `<t:${~~(dblottery.cooldown / 1000)}:R>` : "Desconhecido(a)";
        if (dblottery.users.length > 0) {
            dblottery.users.forEach(user => {
                if (user == message.author.id) { userTickets++ }
            });
            vitoriaPercent = Math.floor((userTickets * 100) / dblottery.users.length).toFixed(2);
            money = Math.floor(dblottery.users.length * 150) + 5000;
        }
        message.reply({ content: `# Rifinha da StarGaby! <:ricaa:1226939070022815894>\n👥 Apostadores: \`${jogadores}\`\n🏆 Último ganhador(a): **${ultimoGanhador.username}**\n🪙 Prêmio atual: **${Number(money).toLocaleString()} gemas**!\n:ticket: Tickets comprados: \`${userTickets}\`\n:alarm_clock: Rifa termina: ${date}\n💸 Dica: Compre tickets custando **200 gemas**, digitando \`${prefixo}rifa\`!` });
    }
}//dev on
