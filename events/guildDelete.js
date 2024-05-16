const { EmbedBuilder } = require('discord.js');
const client = require('../index');


client.on('guildDelete', async (guild) => {
    
//await Guild.findByIdAndDelete({ _id: guild.id });

    const canal = await client.channels.fetch('1232529150636458034');
    const embedCommand = new EmbedBuilder()
        .setTitle("<:saiu:1168387093190430740> › Acabei de sair de um servidor!")
        .setDescription(`<:saiu:1168387093190430740> › Acabei de sair do servidor:\n${guild.name}\n🆔️ › ID: ${guild.id}\n🏡 › Estou agora em ${client.guilds.cache.size} servidores e cuidando de ${client.users.cache.size} usuários!\n<:coroa:1168741847535976538> › Proprietária(o):\n${await guild.fetchOwner().then(a => a.user.username)}`)
        .setThumbnail(guild.iconURL())
        .setColor('White')
        .setTimestamp();

    await canal.send({ embeds: [embedCommand] });

});
