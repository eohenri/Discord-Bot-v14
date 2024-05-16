const client = require('../index');
const { Collection, EmbedBuilder } = require('discord.js');
const Guild = require("../schema/guild");
const User = require("../schema/user");
const prefixes = ['gaby', 'star gaby', 'sg', 'star'];
const botID = "1061329995789766777";
const botMentions = [`<@${botID}>`, `<@!${botID}>`];
const globalCooldownDurationInSeconds = 3;
const commandCooldowns = new Collection();

client.on("messageUpdate", async (oldMessage, newMessage) => {
    if (oldMessage.content === newMessage.content) return;
    if (newMessage.author.bot) return;
    if (!newMessage.guild) return;
    const guilddb = await Guild.findById({ _id: newMessage.guild.id });
    let prefix = guilddb.prefix || 's';
    const foundPrefix = prefixes.find(p => newMessage.content.toLowerCase().includes(p));
    const content = newMessage.content.trim();
    const prefixUsed = newMessage.content.toLowerCase().startsWith(prefix.toLowerCase());
    if (prefixUsed || botMentions.some(mention => content.startsWith(mention))) {
        const args = content.slice(prefix.length).trim().split(' ');
        const userdb = await User.findById({ _id: newMessage.author.id });
        if (!userdb) return;
        if (userdb.blacklist.banido) return;
        if (userdb.premium.vip && Date.now() > userdb.premium.viptime) {
            await User.findByIdAndUpdate({ _id: newMessage.author.id }, { $set: { "premium.vip": false, "premium.viptime": Date.now() } });
        }
        const command = args.shift()?.toLowerCase();
        const cmd = client.comandos.get(command) || client.comandos.find(als => als.aliases && als.aliases.includes(command));
        try {
            cmd.run(client, newMessage, args, prefix);
        } catch (err) {
            return;
        }
    }
});
