const {
    EmbedBuilder
} = require("discord.js");
const User = require("../../schema/user");
const Guild = require("../../schema/guild");
const abreviar = require("../../util/abreviar");
const colors = require("../../util/colors");

module.exports = {
    name: "futebol",
    aliases: ["fut"],
    dev: false,
    run: async (client, message, args, prefixo) => {
   
        let prefix = prefixo || "s";
  
        await message.channel.sendTyping();

        
        const userdb = await User.findOne({ _id: message.author.id });
        if (!userdb) return message.reply({ content: `${message.author}, Você não coletou o daily hoje!` });
 
        const sorte = args[0];

        if (!sorte) return message.reply({ content: `${message.author}, Você deve utilizar no formato:\n\`${prefix}fut <direita/meio/esquerda> <quantia>\`` });
        if (!["direita", "meio", "esquerda"].some(s => s === sorte)) return message.reply({ content: `${message.author}, Você deve utilizar no formato:\n\`${prefix}fut <direita/meio/esquerda> <quantia>\`` });
 
        const valor = args[1];
 
        if (!valor) return message.reply({ content: `${message.author}, Você deve utilizar no formato:\n\`${prefix}fut <direita/meio/esquerda> <quantia>\`` });
        if (!/^[A-Za-z0-9]+$/.test(valor)) return message.reply({ content: `${message.author}, Você deve fornecer apenas números inteiros e positivos.` });
        if (isNaN(valor)) return message.reply({ content: `${message.author}, Você deve fornecer apenas números inteiros e positivos.` })
        if (valor < 500 || valor > 900) return message.reply({ content: `${message.author}, A quantia miníma é de **500 gemas** até no máximo **900 gemas**.` });
        if (userdb.economia.ametistas < valor || valor < 1) return message.reply({ content: `${message.author}, Você não possui saldo suficiente para apostar!` });
      
        //jogo
 
        const sorteio = Math.round(Math.random() * 100);

        if (sorteio > 75) {
         
            message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Penálti bem aplicado. ⚽")
                        .setDescription(`🥅 O goleiro não conseguiu defender sua bola!\nVocê ganhou **<:AMETISTA:1234467310958411858> ${valor} ametistas** nessa partida!`)
                        .setColor(colors.white)
                        .setImage("https://i.imgur.com/oqxKBEe.gif")
                        .setTimestamp()
                        .setFooter({ text: `${message.author.username}`, iconURL: `${message.author.displayAvatarURL()}` })

                ]
            });
            //await User.findByIdAndUpdate({ _id: `${message.author.id}` }, { $inc: { "eco.coins": valor } });
       
        } else {
            
            message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Penálti fracassado. ⚽")
                        .setDescription(`<:Erradoo:1215267846016204822> O goleiro conseguiu defender sua bola!\nVocê perdeu **<:AMETISTA:1234467310958411858> ${valor} ametistas** nessa partida!`)
                        .setColor(colors.dark)
                        .setImage("https://i.imgur.com/oqxKBEe.gif")
                        .setTimestamp()
                        .setFooter({ text: `${message.author.username}`, iconURL: `${message.author.displayAvatarURL()}` })

                ]
            });
            //await User.findByIdAndUpdate({ _id: `${message.author.id}` }, { $inc: { "eco.coins": -valor } });
        }
    }
}
