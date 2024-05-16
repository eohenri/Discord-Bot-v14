const {
  EmbedBuilder,
  ComponentType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");
const User = require("../../schema/user");
const Guild = require("../../schema/guild")
const colors = require("../../util/colors");
const abreviar = require("../../util/abreviar");

module.exports = {
  name: "lavagem",
  category: "economy",
  aliases: ["lavar"],
  run: async (client, message, args, prefix) => {
    let prefixo = prefix || "s";
    const data = await User.findOne({ _id: message.author.id });
    if (!data) return message.reply({ content: `${message.author}, Você deve coletar seu daily antes.` });
    let valor = args[0];
    if (!valor) return message.reply({ content: `${message.author}, Você deve utilizar o comando no formato correto:\n\`${prefixo}lavagem <valor>\`` });
    if (!/^[A-Za-z0-9]+$/.test(valor)) return message.reply({ content: `${message.author}, Você não pode usar símbolos no meio de números, quebra de linha!` });
    if (valor.includes("all")) valor = data.economia.crime;
    if (["m", "k"].some(text => args[0].toLowerCase().endsWith(text)) === true) valor = await abreviar(valor);
    if (isNaN(valor)) return message.reply({ content: `${message.author}, Você forneceu uma quantia inválida!` })
    if (Date.now() < data.cooldowns.lavagem) return message.reply({ content: `<:nysa_cooldown:1217515334924505201> **|** Volte <t:${~~(data.cooldowns.lavagem / 1000)}:R> para lavar seu dinheiro novamente!` });
    if (data.economia.crime < valor || valor < 1) return message.reply({ content: `${message.author}, Saldo de crime insuficiente!` });
    if (data.social.energia < 100) return message.reply({ content: `${message.author}, Essa operação requer **100 de XP**!` });
    if (valor > 5000) return message.reply({ content: `${message.author}, Somente quantias menores que 5,000 Ametistas.` });

    const msg = await message.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Lavagem de moedas <:depppppp:1214529416407941140>")
          .setDescription(`🤝 Você está prestes a lavar **${valor.toLocaleString()} moedas sujas**!\n💸 Você possui **${data.economia.crime.toLocaleString("en-US", { notation: "compact", maximumFractionDigits: 2, })}** moedas sujas.\n\n⚡ Lembre-se que sua ação custará **100** de **XP**!`)
          .setColor(colors.white)
      ],
      components: [
        new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId("rush")
              .setLabel("Aplicar")
              .setEmoji("✅")
              .setStyle(ButtonStyle.Success)
          )
      ], fetchReply: true
    });
    const collector = await msg.createMessageComponentCollector({ componentType: ComponentType.Button, time: 87000 });
    collector.on('collect', async (i) => {
      await i.deferUpdate();
      if (i.user.id !== message.author.id) return;
      collector.stop();
      msg.edit({ content: `📥 ${i.user}, Lavagem efetuada com êxito!\nVocê aplicou uma nova lavagem e **${Number(valor).toLocaleString()} moedas** foram depositadas em sua carteira.`, embeds: [], components: [] });
      await User.findByIdAndUpdate({ _id: message.author.id }, { $inc: { "economia.ametistas": valor, "social.energia": -100 }, $set: { "cooldowns.lavagem": Date.now() + 172800000 } });
    });
    collector.on('end', (collection, reason) => {
      if (reason !== "time") return;
      msg.delete().catch(() => { });
    });
  }
}
// }
//v3 beta testes mel
