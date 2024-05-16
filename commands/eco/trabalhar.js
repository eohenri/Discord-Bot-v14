const {
    EmbedBuilder
} = require('discord.js');
const User = require("../../schema/user");
const colors = require("../../util/colors");

module.exports = {
    name: 'trabalhar',
    category: "economy",
    aliases: ['trabalho', 'work'],
    run: async (client, message, args, prefix) => {

        let p = prefix || "s";

        const jobs = ["médico(a)", "engenheiro(a)", "professor(a)", "vendedor(a)", "bombeiro(a)", "programador(a)", "psicólogo(a)", "arquiteto(a)", "ator/atriz +18", "fotografo(a)", "balconista", "advogado(a)", "psiquiatra", "policial", "genacologista"];
        const job = jobs[Math.floor(Math.random() * jobs.length)];
        const userdb = await User.findOne({ _id: message.author.id });

        if (!userdb) return message.reply({ content: `${message.author}, Você não coletou o daily hoje!` });
        if (Date.now() < userdb.cooldowns.work) return message.reply({ content: `<:nysa_cooldown:1217515334924505201> **|** Volte <t:${~~(userdb.cooldowns.work / 1000)}:R> para trabalhar novamente!` });

        const amount = Math.floor(Math.random() * 500) + 1000;

        message.reply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: `${message.author.username}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` })
                    .setDescription(`Você trabalhou de ${job} e seu salário rendeu **<:AMETISTA:1234467310958411858> ${Number(amount).toLocaleString()} ametistas**!`)
                    .setColor("#942FFA")
            ]
        });


        await User.findByIdAndUpdate({ _id: message.author.id }, { $inc: { "economia.ametistas": amount, "economia.energia": 5 }, $set: { "cooldowns.work": Date.now() + 7200000 } });

    }
}
// dev athena
