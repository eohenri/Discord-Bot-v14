const {
    EmbedBuilder
} = require("discord.js");
const User = require("../../schema/user");
const colors = require("../../util/colors");

module.exports = {
    name: "carro",
    category: "eco",
    aliases: ["carroforte", "cf"],
    run: async (client, message, args) => {
        let data = await User.findOne({ _id: message.author.id });
        if (!data) {
            const criar = new User({ _id: message.author.id })
            await criar.save();
            data = await User.findOne({ _id: message.author.id });
        };
        if (Date.now() < data.cooldowns.carro) return message.reply({ embeds: [new EmbedBuilder().setDescription(`⏰ **|** ${message.author}, Você está no modo de espera nessa tarefa! Libera <t:${~~(data.cooldowns.carro / 1000)}:R>.`).setColor("#ec5353")] });
        let count = 1;
        const msg = await message.reply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: `${message.author.username}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` })
                    .setTitle("Carro forte")
                    .setColor(colors.default)
                    .setImage("https://media.discordapp.net/attachments/1183517943821258862/1194370521614270474/carroforte1.png")
                    .setDescription(`:man_running: **|** Você deve digitar **dinheiro** quantas vezes puder e depois digitar **fugir**! Tempo restando **1 minuto** e caso não fuja a tempo será pego pela policia.`)
            ], fetchReply: true
        });
        const collector = msg.channel.createMessageCollector({ time: 120000 });
        collector.on('collect', async (c) => {
            if (c.author.id !== message.author.id) return;
            const input = c.content;
            if (input === "dinheiro") count++;
            if (input === "fugir") {
                collector.stop();
                const amount = Math.floor(Math.random() * 1000) + 2500;
                msg.delete().catch(() => { });
                c.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({
                                name: `${c.author.username}`,
                                iconURL: `${c.author.displayAvatarURL()}`
                            })
                            .setTitle("Assalto realizado.")
                            .setColor(colors.white)
                            .setTimestamp()
                            .setDescription(`<:Money:1183470666331209879> **|** ${c.author} levou no total **${amount.toLocaleString()}** moedas do carro-forte sem ser capturado.`)
                    ]
                });
                await User.updateOne({ _id: message.author.id }, { $inc: { "economia.crime": amount }, $set: { "cooldowns.carro": Date.now() + 86700000 } });
            }
        });
        collector.on('end', async (collection, reason) => {
            if (reason !== "time") return;
            await User.updateOne({ _id: message.author.id }, { $set: { "cooldowns.carro": Date.now() + 86700000 } });
            msg.delete().catch(() => { });
        });
    }
}
