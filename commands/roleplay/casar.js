const {
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    ComponentType
} = require("discord.js");
const User = require("../../schema/user");
const colors = require("../../util/colors");

module.exports = {
    name: "casar",
    category: "roleplay",
    aliases: ["marry", "casamento"],
    run: async (client, message, args) => {
        let data = await User.findById({ _id: message.author.id });
        if (!data) {
            const criar = new User({ _id: message.author.id });
            await criar.save();
            data = await User.findById({ _id: message.author.id });
        }
        const user = message.mentions.users.first();
        if (!user) return message.reply(`${message.author}, Usuário não encontrado ou mencionado.`);
        if (user.id === message.author.id) return message.reply({ content: `${message.author}, Você não pode casar com si mesmo!`, ephemeral: true });
        if (user.bot) return message.reply({ content: `${message.author}, Você não pode casar com um bot!`, ephemeral: true });

        let data2 = await User.findById({ _id: user.id });

        if (!data2) {
            const criar2 = new User({ _id: user.id });
            await criar2.save();
            data2 = await User.findById({ _id: user.id });
        }

        if (data.casar.casado || data2.casar.casado) return message.reply({ content: `${message.author}, O usuário já se encontra casado(a).` });
        const confirm = new ButtonBuilder()
            .setCustomId('confirm')
            .setLabel('Aceitar pedido')
            .setStyle(ButtonStyle.Success);
        const row = new ActionRowBuilder().addComponents(confirm);

        const msg = await message.reply({
            content: `${user}`,
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: `${message.author.username}`, iconURL: `${message.author.displayAvatarURL()}` })
                    .setThumbnail(message.author.displayAvatarURL())
                    .setDescription(`:ring: ${user.user}, Você recebeu um **pedido de casamento**!\n\nReaja abaixo para "**ACEITAR**" o pedido de casamento!`)
                    .setColor(colors.white)
            ],
            fetchReply: true,
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('confirm')
                            .setEmoji("<:certo:1213102531807416393>")
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId("xexit")
                            .setEmoji("<:Errado:1213102598585057281>")
                            .setStyle(ButtonStyle.Danger)
                            .setDisabled(false)
                    )
            ],
        });
        const collector = await msg.createMessageComponentCollector({ componentType: ComponentType.Button, time: 42000 });
        collector.on('collect', async (i) => {
            await i.deferUpdate();
            if (user.id !== i.user.id) return i.followUp({ ephemeral: true, content: ":x: Esse botão não é para vc!" });
            if (i.customId === "confirm") {
                collector.stop();
                msg.delete().catch(() => { });
                message.channel.send({ content: `:ring: **|** ${user} casou-se com ${message.author}.` });
                await User.findByIdAndUpdate({ _id: message.author.id }, { $set: { "casar.casado": true, "casar.com": user.id, "casar.tempo": Date.now() }, });
                await User.findByIdAndUpdate({ _id: user.id }, { $set: { "casar.casado": true, "casar.com": message.author.id, "casar.tempo": Date.now() }, });
            } else {
                collector.stop();
                msg.delete().catch(() => { });
            }
        });
        collector.on('end', (collection, reason) => {
            if (reason !== "time") return;
            msg.delete().catch(() => { });
            message.channel.send({ content: `${message.author}, sua tentativa de casamento expirou!` });
        });
    }
}
