const {
    EmbedBuilder
} = require('discord.js');

module.exports = async (client, member, db) => {
    const channel = member.guild.channels.cache.get(db.welcomejoin.channel);
    if (!channel) return;
    const embed = new EmbedBuilder()
        .setTitle("<:emotesola4:1216919656175243405> BOAS-VINDAS!")
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setColor("#9f00c5")
        .setDescription(`O usuário ${member} entrou no servidor!`)
        .setFooter({
            text: `ID do usuário: ${client.user.id}`
        })
        .setTimestamp();
    channel.send({
        content: `${member}`,
        embeds: [embed]
    }).catch(() => { });
}
