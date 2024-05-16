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
    name: "divorciar",
    category: "roleplay",
    aliases: ["unmarry", "divorce", "separar"],
    run: async (client, message, args) => {
        const userdb = await User.findById({ _id: message.author.id });
        if (!userdb) return message.reply({ content: `${message.author}, Você não coletou o daily hoje!` });
        if (!userdb.casar.casado) return message.reply({ content: `${message.author}, Você não está casado(a)!` });
        const marryId = userdb.casar.com;
        const msg = await message.reply({
            content: `:ring: ${message.author}, Você está prestes a **desfazer seu casamento**! Reaja no botão :white_check_mark: para prosseguir com o divorcio!\n\n💔 Essa ação não poderá ser desfeita.`,
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('confirm')
                            .setEmoji("<:certo:1213102531807416393>")
                            .setLabel("Confirmar")
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId("xexit")
                            .setEmoji("<:Errado:1213102598585057281>")
                            .setLabel("Cancelar")
                            .setStyle(ButtonStyle.Danger)
                    )
            ],
            fetchReply: true
        });
        const collector = await msg.createMessageComponentCollector({ componentType: ComponentType.Button, time: 32000 });
        collector.on('collect', async (i) => {
            await i.deferUpdate();
            if (message.author.id !== i.user.id) return;
            if (i.customId === "confirm") {
                collector.stop();
                msg.edit({ content: `${i.user} separou-se com sucesso!`, embeds: [], components: [] });
                await User.findByIdAndUpdate({ _id: `${message.author.id}` }, { $set: { "casar.casado": false, }, });
                await User.findByIdAndUpdate({ _id: `${marryId}` }, { $set: { "casar.casado": false, }, });
            } else {
                collector.stop();
                msg.delete().catch(() => { });
            }
        });
        collector.on('end', (collection, reason) => {
            if (reason !== "time") return;
            msg.delete().catch(() => { });
            message.channel.send({ content: `${message.author}, sua tentativa de divorcio expirou!` });
        });
    }
}
// autor Mel
