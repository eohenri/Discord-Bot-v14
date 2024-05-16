const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');
const User = require("../../schema/user");
const colors = require("../../util/colors");

module.exports = {
    name: 'amigo',
    category: "roleplay",
    aliases: ['bf', 'unbf'],
    run: async (client, message, prefix) => {
        let prefixo = prefix || "s.";
        const userdb = await User.findOne({ _id: message.author.id });
        if (!userdb) return message.reply({ content: `${message.author}, Você não coletou o daily hoje!` });
        const user = message.mentions.users.first();
        if (!user) return message.reply({ content: `${message.author}, Você deve usar o comando no formato correto: \`${prefixo}amigo @usuário\`` });
        if (user.id === message.author.id) return message.reply({ content: `${message.author}, Você não pode ser amigo(a) de si mesmo!` });
        if (user.bot) return message.reply({ content: `${message.author}, Você não pode ser amigo(a) de um bot!`, ephemeral: true });

        const msg = await message.reply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: `${message.author.username}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` })
                    .setColor(colors.white)
                    .setDescription(`\> Reaja abaixo para adicionar ou remover um(a) melhor amigo(a)!`)
                    .setTimestamp()
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("addfriend")
                            .setLabel("Adicionar amigo(a)")
                            .setStyle(ButtonStyle.Success)
                            .setDisabled(userdb.social.friend ? true : false),
                        new ButtonBuilder()
                            .setCustomId("rmvfriend")
                            .setLabel("Remover amigo(a)")
                            .setStyle(ButtonStyle.Danger)
                            .setDisabled(!userdb.social.friend)
                    )
            ],
            fetchReply: true
        });
        const collector = await msg.createMessageComponentCollector({ time: 32000 });
        collector.on('collect', async (i) => {
            await i.deferUpdate();
            if (message.author.id !== i.user.id) return;
            if (i.customId === "addfriend") {
                collector.stop();
                msg.edit({ content: `${i.user} seu novo(a) melhor amigo(a) foi definido com sucesso!`, embeds: [], components: [] });
                await User.findByIdAndUpdate({ _id: `${message.author.id}` }, { $set: { "social.friend": user.id, }, });
            } else {
                collector.stop();
                msg.edit({ content: `${i.user} seu novo(a) melhor amigo(a) foi removido com sucesso!`, embeds: [], components: [] });
                await User.findByIdAndUpdate({ _id: `${message.author.id}` }, { $set: { "social.friend": null, }, });

            }
        });
        collector.on('end', (collection, reason) => {
            if (reason !== "time") return;
            msg.delete().catch(() => { });
        });
    }
}
// autor Mel