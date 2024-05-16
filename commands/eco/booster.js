const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");
const User = require("../../schema/user");
const colors = require("../../util/colors");

module.exports = {
    name: "booster",
    category: "economy",
    aliases: ["impulso"],
    run: async (client, message, args, prefix) => {

        let p = prefix || "s";

        const userdb = await User.findOne({ _id: message.author.id });

        if (!userdb) return message.reply({ content: `${message.author}, Você não coletou o daily hoje!` });
        if (Date.now() < userdb.cooldowns.booster) return message.reply({ content: `<:nysa_cooldown:1217515334924505201> **|** Volte <t:${~~(userdb.cooldowns.booster / 1000)}:R> para receber seu bônus novamente!` });
        if (message.guild.id !== "1123064709055262751") return message.reply({ content: `${message.author}, Você poderá ganhar sua recompensa de **<:AMETISTA:1234467310958411858>10,000 ametistas** somente no meu servidor oficial.`, components: [new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel("Resgatar").setURL("https://discord.com/invite/RCYQTDRr9M").setStyle(ButtonStyle.Link))] });
        if (!["1123769391062986783"].some(x => message.member.roles.cache.has(x))) return message.reply({ content: `<:presente:1218187435620434010> ${message.author}, Você ainda não impulsionou esse servidor! Impulsione agora mesmo para receber vantagens bem legais!` });;

        message.reply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: `${message.author.username}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` })
                    .setDescription(`Você coletou sua recompensa de booster e recebeu **<:AMETISTA:1234467310958411858>10,000 ametistas**!`)
                    .setColor("#942FFA")
            ]
        });

        await User.findByIdAndUpdate({ _id: message.author.id }, { $inc: { "economia.ametistas": 10000 }, $set: { "cooldowns.booster": Date.now() + 86400000 } });
   
    }
}
