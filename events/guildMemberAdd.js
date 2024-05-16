const {
    EmbedBuilder
} = require('discord.js');
const client = require('../index');
const Guild = require("../schema/guild");
const JoinEventMessage = require("../util/welcome");
const JoinEventRoleAdd = require("../util/autorole");

client.on('guildMemberAdd', async (member) => {
    let data = await Guild.findOne({ _id: member.guild.id }); // Puxa a data do servidor;
    if (!data) return;
    if (data.welcomejoin.enable) JoinEventMessage(client, member, data);
    if (data.autorole.enable) JoinEventRoleAdd(client, member, data);
});
