const {
  AttachmentBuilder
} = require("discord.js");
const Canvas = require("canvas");
Canvas.registerFont("assets/fonts/BebasNeue-Regular.ttf", { family: "BebasNeue" });
const User = require("../../schema/user");

module.exports = {
  name: 'saldo',
  category: "eco",
  aliases: ['atm', 'ametistas'],
  run: async (client, message, args, prefix) => {
    await message.channel.sendTyping();
    let prefixo = prefix || "s";
    //player
    let user = message.mentions.users.first() || message.author;
    if (!user) return message.reply(`${message.author}, O usuário não foi encontrado.`);
    const userdb = await User.findById({ _id: user.id });
    if (!userdb) return message.reply({ content: `${message.author}, Esse usuário não possui saldo na carteira.` });
    //code v1
    try {
      const canvas = Canvas.createCanvas(500, 600);
      const context = canvas.getContext("2d");
      //avatar
      const avatar = await Canvas.loadImage(user.displayAvatarURL({ extension: 'jpg', size: 4096 }));
      context.drawImage(avatar, 142, 34, 213, 212);
      //template
      const template = await Canvas.loadImage("assets/imgs/saldo.png");
      context.drawImage(template, 0, 0, canvas.width, canvas.height);
      //username
      context.font = 'bold 20px "BebasNeve"';
      context.fillStyle = "#010101";
      context.fillText(`${user.username}`, 145, 295);
      //carteira
      context.font = 'bold 26px "BebasNeve"';
      context.fillStyle = "#010101";
      context.fillText(`${userdb.economia.ametistas.toLocaleString("en-US", { notation: "compact", maximumFractionDigits: 2, })}`, 145, 374);
      //carteira
      context.font = 'bold 26px "BebasNeve"';
      context.fillStyle = "#010101";
      context.fillText(`${userdb.economia.banco.toLocaleString("en-US", { notation: "compact", maximumFractionDigits: 2, })}`, 145, 450);
      //total
      context.font = 'bold 26px "BebasNeve"';
      context.fillStyle = "#010101";
      context.fillText(`${(userdb.economia.ametistas + userdb.economia.banco).toLocaleString("en-US", { notation: "compact", maximumFractionDigits: 2, })}`, 145, 530);
      //send
      const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: "profile.png" });
      message.reply({ content: `${message.author}`, files: [attachment] });
    } catch (err) {
      return;
    }
  }
}
// v3 por mel
