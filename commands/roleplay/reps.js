const {
    EmbedBuilder
} = require('discord.js');
const User = require("../../schema/user");
const colors = require("../../util/colors");

module.exports = {
    name: "reps",
    category: "roleplay",
    aliases: ["reptop", "toprep"],
    run: async (client, message, args) => {
        let placar = await User.find({}).sort({ "social.rep": -1 }).limit(5);
        let content = "";
        for (let i = 0; i <= 4; i++) {
            let user = await client.users.fetch(`${placar[i]._id}`);
            if (!user) user = client.user;
            content += `**#${i + 1}: ${user.username}**` + "\n" + `<:invisivel:1216703440466608209>:star: \`${Math.floor(placar[i].social.rep).toLocaleString()}\`\n`
        }
        message.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Ranking dos usuários com mais reputações da StarGaby! 📊")
                    .setColor(colors.default)
                    .setDescription(`\n\n${content}`)
                    .setTimestamp()
                    .setFooter({ text: `Solicitado por ${message.author.username}`, iconURL: `${message.author.displayAvatarURL()}` })
            ]
        });
    }
}
