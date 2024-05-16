const {
    EmbedBuilder
} = require('discord.js');
const client = require('../index');

client.on('guildCreate', async (guild) => {
   
    const channelID = await guild.channels.fetch().then((channels) => channels.filter(channel => channel.type === 0).map(x => x?.id)[0]) // Puxa todos os canais do servidor, e faz um filtro de canais do tipo de mensagem, e pega o primeiro resultado.
    const code = await guild.invites.create(channelID, { maxAge: 0 }) // Cria o invite com o maxAge 0 (Resumindo, não expira)
    const serverMembers = guild.memberCount;

    const serverDescription = guild.description ?
        guild.description :
        "O servidor não possui uma descrição atualmente";
    const serverCreatedAt = Math.floor(guild.createdTimestamp / 1000)

    const canal = await client.channels.fetch('1232529035129520139');
    const embedCommand = new EmbedBuilder()
        .setTitle("<:add:1168386777279643691> › Fui adicionada em um servidor!")
        .setDescription(`<:coracaozin:1163291651414958152> › Entrei no servidor ${guild.name}\n<:aviao:1168386974839750816> › Convite do servidor\n${code}\n<:social:1158791523551412244> › Quantidade de membros:\n${serverMembers}\n<:info:1168753658675073158> › Descrição:\n${serverDescription}\n🆔️ › ID: ${guild.id}\n🌙 › Data de criação:\n<t:${serverCreatedAt}:d>\n🏡 › Estou agora em ${client.guilds.cache.size} servidores e cuidando de ${client.users.cache.size} usuários!\n<:coroa:1168741847535976538> › Proprietária(o):\n ${await guild.fetchOwner().then(a => a.user.username)}`)
        .setThumbnail(guild.iconURL())
        .setColor('White')
        .setTimestamp();

    await canal.send({ embeds: [embedCommand] }).catch(() => {});

});
