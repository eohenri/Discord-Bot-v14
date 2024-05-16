const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");
const User = require("../../schema/user");
const Guild = require("../../schema/guild")
const colors = require("../../util/colors");
const abreviar = require("../../util/abreviar");

module.exports = {
    name: "crash",
    category: "eco",
    aliases: ["cassino"],
    run: async (client, message, args) => {
        let result = Math.ceil(Math.random() * 12);
        let dbguild = await Guild.findOne({ _id: message.guild.id }); // Puxa a data do servidor;
        if (!dbguild) {
            const db = new Guild({ _id: message.guild.id, });
            await db.save(); // Se não houver data, ele cria uma nova e salva o prefixo padrão;
            dbguild = await Guild.findOne({ _id: message.guild.id });
        }
        const prefix = dbguild.prefix;
        let data = await User.findOne({ _id: message.author.id });
        if (!data) {
            const criar = new User({ _id: message.author.id })
            await criar.save();
            data = await User.findOne({ _id: message.author.id });
        };
        let money = args[0];
        if (!money) return message.reply({ content: `<a:Erro:1178773952659726346> › ${message.author}, Você deve utilizar o comando no formato correto: **${prefix}crash <quantia>**` });
        if (!/^[A-Za-z0-9]+$/.test(money)) return message.reply({ content: `<a:Erro:1178773952659726346> › **${message.author.username}**, Você não pode usar símbolos no meio de números, quebra de linha.`, ephemeral: true });
        if (money.includes("all")) money = data.economia.ametistas;
        if (["m", "k"].some(text => args[0].toLowerCase().endsWith(text)) === true) money = await abreviar(money);
        if (isNaN(money)) return message.reply({ content: `<a:Erro:1178773952659726346> › ${message.author}, Você forneceu um número inválido!` })
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('crash_stop')
                    .setEmoji("🛑")
                    .setStyle(ButtonStyle.Danger),
            )

        const disableRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('crash_stop')
                    .setEmoji("🛑")
                    .setStyle(ButtonStyle.Danger)
                    .setDisabled(true),
            )
        message.reply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({
                        name: `${message.author.username}`,
                        iconURL: `${message.author.displayAvatarURL()}`
                    })
                    .setTitle("💎 [CRASH!] 💎")
                    .setDescription(`Você iniciou essa partida com a quantia inicial de **${money.toLocaleString()} ametistas**.`)
                    .addFields({
                        name: "⭐ | Multiplicador:",
                        value: "Iniciando.."
                    }, {
                        name: "💸 | Lucro:",
                        value: "Iniciando.."
                    })
                    .setImage("https://media.discordapp.net/attachments/1183517943821258862/1184576584632516618/809686b8019d942645c100ee8dae5101.gif")
                    .setColor(colors.white)
                    .setFooter({
                        text: "Use 🛑 para encerrar!"
                    })
            ],
            components: [disableRow]
        }).then(async (msg) => {
            let multiplier = 1;
            let index = 0;
            let times = result + 1;
            let timer = 2000 * times;
            setInterval(async() => {
                if (index === result + 1) { return }
                else if (index === result) {
                    await User.findByIdAndUpdate({ _id: message.author.id }, { $inc: { "economia.ametistas": -money }, });
                    return msg.edit({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: `${message.author.username}`,
                                    iconURL: `${message.author.displayAvatarURL()}`
                                })
                                .setTitle("❌ [CRASH - DERROTA] ❌")
                                .setDescription(`Você iniciou essa partida com a quantia inicial de **${money.toLocaleString()} ametistas** e perdeu essa partida.`)
                                .addFields({
                                    name: "💸 | Perda:",
                                    value: `**${money}**`
                                })
                                .setColor(colors.default)
                                .setFooter({
                                    text: "Jogue e seja o vencedor!"
                                })
                        ],
                        components: [disableRow]
                    });

                }
                else {
                    index += 1;
                    multiplier += 0.20;
                    let calc = money * multiplier;
                    let profit = calc - money;
                    msg.edit({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: `${message.author.username}`,
                                    iconURL: `${message.author.displayAvatarURL()}`
                                })
                                .setTitle("🚀 [CRASH!] 🚀")
                                .setDescription(`Você iniciou essa partida com a quantia inicial de **${money.toLocaleString()} ametistas**.`)
                                .addFields({
                                    name: "⭐ | Multiplicador:",
                                    value: `${multiplier.toFixed(1)}x`
                                }, {
                                    name: "💸 | Lucro:",
                                    value: `**$${profit.toFixed(2)}**`,
                                })
                                .setColor(colors.default)
                                .setImage("https://media.discordapp.net/attachments/1183517943821258862/1184567702396883024/1z4b.gif")
                                .setFooter({
                                    text: "Use 🛑 para encerrar!"
                                })
                        ],
                        components: [row]
                    })
                }
            }, 3000);
            const filter = i => i.user.id === message.author.id;
            msg.awaitMessageComponent({ filter, max: 1, time: timer }).then(async (i) => {
                await i.deferUpdate();
                if (i.user.id !== message.author.id) return i.followUp({ ephemeral: true, content: ":x: Esse botão não é para vc!" });
                if (i.customId === "crash_stop") {
                    i.deferUpdate();
                    index = result + 1;
                    profit = money * multiplier;
                    await User.findByIdAndUpdate({ _id: message.author.id }, { $inc: { "economia.ametistas": -money }, });
                    return msg.edit({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: `${message.author.username}`,
                                    iconURL: `${message.author.displayAvatarURL()}`
                                })
                                .setTitle("🎉 [CRASH - VITÓRIA] 🎉")
                                .setDescription(`Você iniciou essa partida com a quantia inicial de **${money.toLocaleString()} ametistas** e venceu essa partida.`)
                                .addFields({
                                    name: "💸 | Lucro:",
                                    value: `**$${profit.toFixed(2)}**`,
                                })
                                .setColor(colors.default)
                                .setFooter({
                                    text: "Jogue e seja o vencedor!"
                                })
                        ],
                        components: [disableRow]
                    })
                }
            }).catch(async () => {
                index = result + 1;
                await User.findByIdAndUpdate({ _id: message.author.id }, { $inc: { "economia.ametistas": -money }, });
                return msg.edit({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({
                                name: `${message.author.username}`,
                                iconURL: `${message.author.displayAvatarURL()}`
                            })
                            .setTitle("❌ [CRASH - DERROTA!] ❌")
                            .setDescription(`Você iniciou essa partida com a quantia inicial de **${money.toLocaleString()} ametistas** e perdeu essa partida.`)
                            .addFields({
                                name: "💸 | Perda:",
                                value: `**${money.toLocaleString()}**`
                            })
                            .setColor(colors.default)
                            .setFooter({
                                text: "Jogue e seja o vencedor!"
                            })
                    ],
                    components: [disableRow]
                });
            });
        });
    }
}
