const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionsBitField,
  ComponentType,
  RoleSelectMenuBuilder
} = require("discord.js");
const Guild = require("../../schema/guild");
const colors = require("../../util/colors");

module.exports = {
  name: "autorole",
  category: "settings",
  alises: ["autocargo"],
  run: async (client, message, args) => {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return message.reply({ content: `${message.author}, Você não possui permissão de gerenciar servidor!` });
    const data = await Guild.findById({ _id: message.guild.id });
    if (!data) return;
    const msg = await message.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("AutoRole")
          .setDescription(`<:setta:1217816527013679155> Status: ${data.autorole.enable ? "<:ligado:1197190648663646339> \`Ligado!\`" : "<:Desligado:1197194094947078288> \`Desligado!\`"}\n<:setta:1217816527013679155> Cargo: ${data.autorole.enable ? `<@&${data.autorole.roleId}>` : "Não setado!"}`)
          .setFooter({ text: "Recurso para adicionar cargo nos novos membros." })
          .setColor(colors.white)
      ],
      components: [
        new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId("onsystem")
              .setLabel("Ativar")
              .setStyle(ButtonStyle.Success)
              .setDisabled(data.autorole.enable),
            new ButtonBuilder()
              .setCustomId("setrole")
              .setLabel("Definir cargo")
              .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
              .setCustomId("offsystem")
              .setLabel("Desativar")
              .setStyle(ButtonStyle.Danger)
              .setDisabled(!data.autorole.enable)
          )
      ], fetchReply: true
    });
    const collector = await msg.createMessageComponentCollector({ componentType: ComponentType.Button, time: 32000 });
    collector.on('collect', async (i) => {
      await i.deferUpdate();
      if (i.user.id !== message.author.id) return;
      const input = i.customId;
      if (input === "onsystem") {
        if (data.autorole.roleId === 'false') return i.followUp({ content: ":x: Nenhum cargo foi configurado!", ephemeral: true });
        collector.stop();
        await Guild.updateOne({ _id: i.guild.id }, { $set: { "autorole.enable": true } });
        msg.edit({ content: `<a:CERTO:1213127081890938982> **|** ${i.user}, Você ativou o cargo automático com sucesso!`, embeds: [], components: [] });
      } else if (input === "offsystem") {
        collector.stop();
        await Guild.updateOne({ _id: i.guild.id }, { $set: { "autorole.enable": false } });
        return msg.edit({ content: `<a:CERTO:1213127081890938982> **|** ${i.user}, Você desativou o cargo automático com sucesso!`, embeds: [], components: [] });
      } else if (input === "setrole") {
        collector.stop();
        const roleMenu = new RoleSelectMenuBuilder()
          .setCustomId('selectrole')
          .setPlaceholder('Selecione o cargo')
          .setMinValues(1)
          .setMaxValues(1);
        const row2 = new ActionRowBuilder().addComponents(roleMenu);
        const msg2 = await msg.edit({ content: `<a:setar_roxooulilas:1215098342263099393> **|** ${i.user}, Selecione o "**__CARGO__**" que será adicionado automaticamente para novos membros:`, embeds: [], components: [row2], fetchReply: true });
        const collector2 = await msg2.createMessageComponentCollector({ time: 87000 });
        collector2.on('collect', async (inter) => {
          await inter.deferUpdate();
          if (inter.user.id !== message.author.id) return;
          const roleId = inter.values[0];
          const role = inter.guild.roles.cache.get(roleId);
          if (!role) return inter.followUp({ content: ":x: O cargo não foi encontrado ou excluido!", ephemeral: true });
          if (role.managed) return inter.followUp({ content: ":x: O cargo não pode ser gerenciado por mim!", ephemeral: true });
          await Guild.updateOne({ _id: inter.guild.id }, { $set: { "autorole.roleId": roleId } });
          msg2.edit({ content: `<a:CERTO:1213127081890938982> **|** ${inter.user}, Você definiu <@&${roleId}> para cargo automático com sucesso!`, components: [] });
        });
        collector2.on('end', (collection, reason) => {
          if (reason !== "time") return;
          msg2.delete().catch(() => { });
        });
      }
    });
    collector.on('end', (collection, reason) => {
      if (reason !== "time") return;
      msg.delete().catch(() => { });
    });
  }
}
// autor Mel
