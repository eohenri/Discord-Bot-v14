const {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder
} = require('discord.js')
const client = require('../index')
const Guild = require("../schema/guild");

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  let data = await Guild.findOne({ _id: message.guild.id }); // Puxa a data do servidor;
  if (!data) {
    const db = new Guild({ _id: message.guild.id, });
    await db.save(); // Se não houver data, ele cria uma nova e salva o prefixo padrão;
    data = await Guild.findOne({ _id: message.guild.id });
  }
  let mencoes = [`<@${client.user.id}>`, `<@!${client.user.id}>`]
  mencoes.forEach(element => {
    if (message.content === element) {
      if (!message.channel.permissionsFor(client.user.id).has('EmbedLinks')) return; if (!message.channel.permissionsFor(client.user.id).has('SendMessages')) return;
      message.reply({
        content: `👋 **Oiii**! ${message.author}, meu prefixo nesse servidor é \`${data.prefix}\`\nVeja meus comandos usando \`${data.prefix}ajuda\``,
        components: [
          new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setLabel("Me adicione")
                .setURL("https://discord.com/oauth2/authorize?client_id=1108562673899143168&scope=bot%20applications.commands&permissions=2146958847")
                .setStyle(ButtonStyle.Link),
              new ButtonBuilder()
                .setLabel("Suporte")
                .setURL("https://discord.com/invite/RCYQTDRr9M")
                .setStyle(ButtonStyle.Link)
            )
        ]
      });
    }
  })

})
