const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");
const User = require("../../schema/user");
const Guild = require("../../schema/guild");
const colors = require("../../util/colors");

module.exports = {
    name: "glass",
    category: "economy",
    aliases: ["copo", "copos"],
    run: async (client, message, args, prefix) => {
  
        let prefixo = prefix || "s";
   
        const userdb = await User.findOne({ _id: message.author.id });
        if (!userdb) return message.reply({ content: `${message.author}, Você não coletou o daily hoje!` });
    
        let amount = args[0];
   
        if (!amount || isNaN(amount)) return message.reply({ content: `${message.author}, Você não forneceu a quantia da aposta.` });
        if (amount > 1500 || amount < 200) return message.reply({ content: `${message.author}, A quantia mínima é **200 gemas** até no máximo **1,500 gemas**.` });
        if (userdb.economia.ametistas < amount) return message.reply({ content: `${message.author}, Você não possui saldo suficiente para apostar!` });
  
        const sortes = ["cop1", "cop2", "cop3"];
        const sortear = sortes[Math.floor(Math.random() * sortes.length)];
   
        const msg = await message.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Descubra onde a bolinha está escondida!")
                    .setDescription(`👊 Encontre a bolinha para ganhar seu prêmio..`)
                    .setColor(colors.dark)
                    .setThumbnail("https://images.vexels.com/media/users/3/220924/isolated/preview/3e682698845eb0763196f56198281133-icone-plano-de-bebida-de-copo-vermelho.png")
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("cop1")
                            .setLabel("COPO 1")
                            .setEmoji("<:copo:1196023841324028055>")
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId("cop2")
                            .setLabel("COPO 2")
                            .setEmoji("<:copo:1196023841324028055>")
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId("cop3")
                            .setLabel("COPO 3")
                            .setEmoji("<:copo:1196023841324028055>")
                            .setStyle(ButtonStyle.Success)
                    )],
            fetchReply: true
        });

        const coletou = msg.createMessageComponentCollector({ time: 86000 });

        coletou.on('collect', async (i) => {
     
            await i.deferUpdate().catch(() => { return; });
         
            if (i.user.id !== message.author.id) return;
       
            const input = i.customId;
      
            coletou.stop()
      
            if (input === sortear) {
                await User.findByIdAndUpdate({ _id: message.author.id }, { $inc: { "economia.ametistas": amount, }, });
                return msg.edit({ content: `👏 **_PARABÉNS.._**!\n${i.user}, Você escolheu o copo correto e ganhou **<:AMETISTA:1234467310958411858> ${amount} ametistas**!`, embeds: [], components: [] })
            } else {
                await User.findByIdAndUpdate({ _id: message.author.id }, { $inc: { "economia.ametistas": -amount, }, });
                return msg.edit({ content: `<:Erradoo:1215267846016204822> **_QUE PENA.._**!\n${i.user}, Você escolheu o copo errado e perdeu **<:AMETISTA:1234467310958411858> ${amount} ametistas**!`, embeds: [], components: [] })
            }
    
        });
     
        coletou.on('end', (collection, reason) => {
            if (reason !== "time") return;
            msg.delete().catch(() => { return });
        });
    }
}
