const {
  Collection,
  EmbedBuilder
} = require('discord.js');
const Guild = require("../schema/guild");
const User = require("../schema/user");
const client = require('../index');
// Defina os prefixos, menções e o tempo de cooldown global
const prefixes = ['gaby', 'star gaby', 'star']; // Para funcionar com o nome dela
const botID = "1108562673899143168"; // Obtenha o ID do bot corretamente
const botMentions = [`<@${botID}>`, `<@!${botID}>`]; // Use o ID do bot nas menções
const globalCooldownDurationInSeconds = 3; // Tempo de cooldown global em segundos (10 segundos)
const commandCooldowns = new Collection();

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (message.guild === null && botMentions.some(mention => message.content.includes(mention))) {
    return message.reply(`**${message.author.displayName}** Desculpe, não posso responder às menções em mensagens diretas.`);
  }
  let dbuser = await User.findById({ _id: message.author.id });
  if (!dbuser) {
    const createUser = new User({ _id: message.author.id });
    await createUser.save();
    dbuser = await User.findById({ _id: message.author.id });
  }
  if (dbuser.afk.ativo) {
    await User.updateOne({ _id: message.author.id }, { $set: { "afk.ativo": false } });
    message.channel.send(`:bell: **|** ${message.author}, Você desativou o modo **(AFK/Ausente)** ao falar no chat.`).then((reply) => {
      setTimeout(() => {
        reply.delete();
      }, 10000);
    });
  }
  let dbguild = await Guild.findOne({ _id: message.guild.id });
  if (!dbguild) {
    const createGuild = new Guild({ _id: message.guild.id });
    await createGuild.save();
    dbguild = await Guild.findOne({ _id: message.guild.id });
  }
  let prefix = dbguild.prefix || '?'; // Prefix padrão (Do servidor);
  const foundPrefix = prefixes.find(p => message.content.toLowerCase().includes(p)); // Verificar o prefixo com os nomes da Bot da const (prefixes)
  if (foundPrefix) prefix = foundPrefix;
  const content = message.content.trim();
  const prefixUsed = message.content.toLowerCase().startsWith(prefix.toLowerCase());
  if (prefixUsed || botMentions.some(mention => content.startsWith(mention))) {
    const args = content.slice(prefix.length).trim().split(' ');
    if (dbuser.blacklist.banido) return message.reply({ content: `**<:Blacklist:1108230017642664026> › Hey!! Pelo visto você acabou indo de f...(banido de utilizar meus comandos).**\n<:Info:1191085703677882469> › **__Motivo do banimento__**:${dbuser.blacklist.motivo}\n** 📅 › __Data do banimento__**:<t:${~~(dbuser.blacklist.time / 1000)}>` });
    if (dbuser.premium.vip && Date.now() > dbuser.premium.viptime) {
      await User.findByIdAndUpdate({ _id: message.author.id }, { $set: { "premium.vip": false, "premium.viptime": Date.now() } });
    }
    const command = args.shift()?.toLowerCase();
    const cmd = client.comandos.get(command) || client.comandos.find(als => als.aliases && als.aliases.includes(command));
    if (commandCooldowns.has(message.author.id)) {
      const globalCooldownExpiration = commandCooldowns.get(message.author.id);
      if (Date.now() < globalCooldownExpiration) {
        const remainingTimeInSeconds = Math.ceil((globalCooldownExpiration - Date.now()) / 1000);
        const cooldownMessage = `Aguarde **${remainingTimeInSeconds}** segundos antes de utilizar outro comando!`;
        message.reply(cooldownMessage)
          .then((reply) => {
            setTimeout(() => {
              reply.delete();
            }, 10000);
          });
        return;
      }
    }
    commandCooldowns.set(message.author.id, Date.now() + globalCooldownDurationInSeconds * 1000);
    if (cmd) {
      const canal = await client.channels.fetch('1232529262024851529');
      if (!canal) return;
      await canal.send({
        embeds: [new EmbedBuilder()
          .setTitle("<:slash:1158776340066074784>  › Comando em prefixo utilizado!")
          .setDescription(`<:Nickname:1161130067120898058> › Usuário:\n${message.author.username}\n🆔️ › id do usuário:\n${message.author.id}\n🔧 › s.${command}\n✨️ › Shard:\n${message.guild.shardId}\n🏡 › Servidor:\n${message.guild.name}\n🆔️ › ID do servidor:\n${message.guild.id}`)
          .setThumbnail(message.guild.iconURL())
          .setColor('White')
          .setTimestamp()]
      })
      await cmd.run(client, message, args, prefix);
    }
    setTimeout(() => {
      commandCooldowns.delete(message.author.id);
    }, 3000);
  }
});

