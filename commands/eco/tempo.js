const {
  EmbedBuilder
} = require("discord.js");
const User = require("../../schema/user");
const Guild = require("../../schema/guild");
const colors = require("../../util/colors");

module.exports = {
  name: "tempo",
  category: "economy",
  aliases: ["cd", "intervalos", "cooldowns", "tarefas", "missões"],
  run: async (client, message, args, prefix) => {
    let prefixo = prefix || "s";
    await message.channel.sendTyping();
    const data = await User.findOne({ _id: message.author.id });
    if (!data) return message.reply({ content: `${message.author}, Você não coletou o daily hoje!` });
    message.reply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({ name: "Seus intervalos", iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` })
          .setColor(colors.white)
          .setThumbnail("https://cdn-icons-png.freepik.com/256/2838/2838590.png")
          .setDescription(`${Date.now() > data.cooldowns.daily ? `✅ **Daily**: Pronto para uso!` : `🕛 **Daily**: <t:${~~(data.cooldowns.daily / 1000)}:R>`}\n${Date.now() > data.cooldowns.work ? `✅ **Work**: Pronto para uso!` : `🕛 **Work**: <t:${~~(data.cooldowns.work / 1000)}:R>`}\n${Date.now() > data.cooldowns.pescar ? `✅ **Pescar**: Pronto para uso!` : `🕛 **Pescar**: <t:${~~(data.cooldowns.pescar / 1000)}:R>`}\n${Date.now() > data.cooldowns.semanal ? `✅ **Semanal**: Pronto para uso!` : `🕛 **Semanal**: <t:${~~(data.cooldowns.semanal / 1000)}:R>`}\n${Date.now() > data.cooldowns.rep ? `✅ **Rep**: Pronto para uso!` : `🕛 **Rep**: <t:${~~(data.cooldowns.rep / 1000)}:R>`}\n${Date.now() > data.cooldowns.mensal ? `✅ **Mensal**: Pronto para uso!` : `🕛 **Mensal**: <t:${~~(data.cooldowns.mensal / 1000)}:R>`}\n${Date.now() > data.cooldowns.crime ? `✅ **Crime**: Pronto para uso!` : `🕛 **Crime**: <t:${~~(data.cooldowns.crime / 1000)}:R>`}\n${Date.now() > data.cooldowns.lavagem ? `✅ **Lavagem**: Pronto para uso!` : `🕛 **Lavagem**: <t:${~~(data.cooldowns.lavagem / 1000)}:R>`}\n${Date.now() > data.cooldowns.topgg ? `✅ **Votar**: Pronto para uso!` : `🕛 **Votar**: <t:${~~(data.cooldowns.topgg / 1000)}:R>`}\n${Date.now() > data.cooldowns.assalto ? `✅ **Roubar**: Pronto para uso!` : `🕛 **Roubar**: <t:${~~(data.cooldowns.assalto / 1000)}:R>`}\n${Date.now() > data.cooldowns.booster ? `✅ **Booster**: Pronto para uso!` : `🕛 **Booster**: <t:${~~(data.cooldowns.booster / 1000)}:R>`}`)
      ]
    });
  }
}
// dev mel
