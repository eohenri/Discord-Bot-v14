const {
    EmbedBuilder
} = require('discord.js');
const User = require("../../schema/user");
const emojis = require("../../util/emotes.js")
const Owners = [ 
   "1148575199269228655", //Mel
   "797922004920827904",
   "1046838112833253486" //henri
];// Coloque seu ID

module.exports = {
    name: 'premium',
    category: "beta",
    aliases: ['vip-set'],
    run: async (client, message, args) => {
        if (!Owners.includes(message.author.id)) return message.reply({ content: `${emojis.errado} › **${message.author.username}**, Apenas o meus desenvolvedores podem utilizar este comando!` })
        //if (args[0] === "set") {
            let user = message.mentions.users.first() || (await client.users.fetch(args[0]));
            if (!user) return message.reply({ content: `${emojis.errado} › **${message.author.username}**, Você precisa mencionar algum usuário!` });
            let data = await User.findOne({ _id: user.id });
            if (!data) {
                const criar = new User({ _id: user.id })
                await criar.save();
                data = await User.findOne({ _id: user.id });
            };
            if (data.premium.vip) return message.reply({ content: `${emojis.errado} › ${message.author}, O usuário já possui premium na conta!` });
            await User.findByIdAndUpdate({ _id: user.id }, { $set: { "premium.vip": true, "premium.viptime": Date.now() + 2592000000 } });
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: `${client.user.username}`,
                    iconURL: `${client.user.displayAvatarURL()}`
                })
                .setTitle(`${emojis.dev_sg} PREMIUM!`)
                .setDescription(`O usuário ${user} recebeu premium com duração de **30 dias**!`)
                .setColor("#7f3e98")
                .setThumbnail(user.displayAvatarURL({ dyncamic: true }))
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        //}
        /*let db = await User.findOne({ _id: message.author.id });
        if (!db) {
            const criar = new User({ _id: message.author.id })
            await criar.save();
            db = await User.findOne({ _id: message.author.id });
        };
        if (!db.premium.vip) return message.reply({ content: `${emojis.errado} › ${message.author}, Você não possui o premium na conta!` });
        const embed = new EmbedBuilder()
            .setAuthor({
                name: `${client.user.username}`,
                iconURL: `${client.user.displayAvatarURL()}`
            })
            .setTitle(`${emojis.gemagif} PREMIUM!`)
            .setColor("#7f3e98")
            .addFields({
                name: "Seu premium acaba:",
                value: `<t:${~~(db.premium.viptime / 1000)}:R>`
            })
            .setThumbnail(message.author.displayAvatarURL({ dyncamic: true }))
            .setTimestamp();
        return message.reply({ embeds: [embed] });*/
    }
}
