const {
  AttachmentBuilder
} = require("discord.js");
const Canvas = require("canvas");
Canvas.registerFont("assets/fonts/BebasNeue-Regular.ttf", { family: "BebasNeue" });
const User = require("../../schema/user");

module.exports = {
  name: 'perfil',
  category: "roleplay",
  aliases: ['profile', 'inv'],
  run: async (client, message, args) => {
    try {
      let user = message.mentions.users.first() || (await client.users.fetch(`${message.author.id}`));
      if (!user) return message.reply(`<a:Erro:1178773952659726346> › ${message.author}, O usuário não foi encontrado.`);
      let userdb = await User.findOne({ _id: user.id });
      if (!userdb) {
        const criar = new User({ _id: user.id });
        await criar.save();
        userdb = await User.findOne({ _id: user.id });
      }
      //code
      await message.channel.sendTyping();
      const canvas = Canvas.createCanvas(800, 600);
      const context = canvas.getContext("2d");
      //fundo
      const fundo = await Canvas.loadImage("assets/imgs/IMG_20240312_110149.png");
      context.drawImage(fundo, 0, 0, canvas.width, canvas.height);
      //avatar
      const avatar = await Canvas.loadImage(user.displayAvatarURL({ extension: 'jpg', size: 4096 }));
      context.save();
      context.beginPath();
      context.arc(2 + 100, 247 + 100, 197 / 2, 0, Math.PI * 2);
      context.clip();
      context.drawImage(avatar, 2, 246, 198, 200);
      context.restore();
      //template
      const template = await Canvas.loadImage("assets/imgs/fundoupdate.png");
      context.drawImage(template, 0, 0, canvas.width, canvas.height);
      //nome
      context.font = '500 40px "BebasNeue"';
      context.fillStyle = "#010101";
      context.fillText(`${user.username.toUpperCase() || "Desconhecido!"}`, 240, 373);
      //starcoins
      context.font = 'bold 26px "BebasNeve"';
      context.fillStyle = "#010101";
      context.fillText(`${userdb.economia.ametistas.toLocaleString("en-US", { notation: "compact", maximumFractionDigits: 2, })}`, 117, 510);
      //xp
      context.font = 'bold 26px "BebasNeve"';
      context.fillStyle = "#010101";
      context.fillText(`${userdb.social.energia.toLocaleString("en-US", { notation: "compact", maximumFractionDigits: 2, })} XP!`, 370, 510);
      // reps
      context.font = 'bold 26px "BebasNeve"';
      context.fillStyle = "#010101";
      context.fillText(`${userdb.social.rep.toLocaleString("en-US", { notation: "compact", maximumFractionDigits: 2, })} reps`, 117, 570);
      //about
      context.font = '500 25px "BebasNeve"';
      context.fillStyle = "#010101";
      context.fillText(`${userdb.perfil.sobremim}`, 185, 452);
      //marry
      if (userdb.casar.casado) {
        let user = await client.users.fetch(userdb.casar.com);
        if (!user) user = client;
        context.font = 'bold 25px "BebasNeve"';
        context.fillStyle = "#010101";
        context.fillText(`${user.id === client.user.id ? "Opss!" : `${user.username}`}`, 370, 568);
      } else {
        context.font = 'bold 25px "BebasNeve"';
        context.fillStyle = "#010101";
        context.fillText(`Solteiro(a)!`, 370, 568);
      }
      //send
      const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: "profile.png" });
      message.reply({ content: `${message.author}`, files: [attachment] });
    } catch (err) {
      return message.reply({ content: `Falha: ${err}` });
    }
  }
} 
