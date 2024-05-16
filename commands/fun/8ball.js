//opa
const {
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder
} = require("discord.js")
const color = require("../../util/colors.js")
module.exports = {
    name: '8ball',
    aliases: ['adivinho', 'vieirinha', 'magicball', 'bolamagica'],
    run: async (client, message, agrs) => {
        let pergunta = agrs.join(" ");
        if (!pergunta) return message.channel.send(`Você precisa fazer uma pergunta!`);
        let palavras = [
            "Sim.",
            "Não.",
            "Talvez",
            "Provavelmente.",
            "Provavelmente não.",
            "Não sei responder."
        ];
        const result = palavras[Math.floor(Math.random() * palavras.length)];
        const emb = new EmbedBuilder()
            .setAuthor({
                name: `${message.author.username} - Tire suas duvidas.`,
                iconURL: `${message.author.displayAvatarURL()}`
            })
            .setTitle('🔮 Bola magica')
            .setColor(color.pink)
            .addFields({
                name: "❔ | Pergunta:",
                value: `${pergunta}`,
                inline: true
            }, {
                name: "✨ | Resposta:",
                value: `${result}`,
                inline: true
            })
        message.reply({
            embeds: [emb],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel(`Enviado por: ${message.author.username}.`)
                            .setURL(`https://discord.com/users/${message.author.id}`)
                            .setStyle(ButtonStyle.Link))
            ]
        });
    }
}
