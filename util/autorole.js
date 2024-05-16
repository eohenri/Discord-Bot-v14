const {
    EmbedBuilder
} = require('discord.js');

module.exports = async (client, member, db) => {
    const guild = member.guild;
    const role = guild.roles.cache.get(db.autorole.roleId);
    if (!role) return;
    member.roles.add(role.id).catch(() => { });
}