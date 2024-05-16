const {
    EmbedBuilder
} = require('discord.js');
const User = require("../../schema/user");
const colors = require("../../util/colors");

module.exports = {
    name: "sobremim",
    category: "roleplay",
    aliases: ["rabout", "bio"],
    run: async (client, message, args, prefix) => {
        let prefixo = prefix || "s";
        await message.channel.sendTyping();
        const userdb = await User.findById({ _id: message.author.id });
        if (!userdb) return message.reply({ content: `${message.author}, Você não coletou o daily hoje!` });
        if (userdb.economia.ametistas < 10000) return message.reply({ content: `${message.author}, Você não possui **10,000 moedas** para pagar a taxa.` });
        const bio = args.join(" ");
        //valor de tamanho do texto não mexer 
        if (bio.length < 2 || bio.length > 12) return message.reply({ content: `${message.author}, Você deve fornecer no minimo 3 palavras com no máximo 12 palavras.` });
        message.reply({ content: `<:corretoo:1215267550225637416> ${message.author}, Você alterou seu sobremim com sucesso, pagando uma taxa de **10,000 moedas**.` });
        await User.findByIdAndUpdate({ _id: message.author.id }, { $inc: { "economia.ametistas": -10000 }, $set: { "perfil.sobremim": bio } });
    }
}