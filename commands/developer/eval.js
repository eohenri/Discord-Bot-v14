const Discord = require("discord.js");
const { inspect } = require("node:util");
const emoji = require("../../util/emotes.js")
const cor = require("../../util/colors.js")
const Owners = [
    /*"1046838112833253486",
    "1148575199269228655"*/
]
module.exports = {
    name: 'eval',
    category: 'developer',
    aliases: ['e', 'ev'],
    run: async (client, message, args) => {
        const {
            guild,
            user,
            author,
            channel
        } = message;

        if (!Owners.includes(message.author.id)) return; //não pode deixar mensagem vazia da erro de boby
        const code = args.join(" ")
        if(!code) return message.reply(`Ops! Você precisa escrever um codigo!`)
        if (["leave", "token"].some(x => code.includes(x))) return message.reply({ content: `${message.author}, Você não pode me remover de servidores e nem revelar o meu token!` })
        try {
            const result = inspect(await eval(code), { depth: 0 });
            if (result.length > 4096) {
            message.reply(`>>> O resultado atingiu o limite!`)

            } else { 
                const msg = await message.reply(`>>> \`\`\`js\n${result}\n\`\`\``)
                message.react('<:g_correto:1216599827706806292>')
            }
        }  catch (err) {
            const msg = await message.reply(`>>> \`\`\`js\n${err}\n\`\`\``)
            message.react('<:erro1:1216599822056947764>');
        }

    }
}
