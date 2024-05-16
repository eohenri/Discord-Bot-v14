const client = require('../index');
const { ActivityType } = require('discord.js');
const list = client => ['🆘 | Ajude o Rio Grande Do Sul! -> https://muginn.xyz/ajude-o-rio-grande-do-sul/', /*'💙 › Melhores mangás estão na SlimeRead! | discord.gg/slimeread ‹ 💙',*/ `🚀 Speed Cloud!`/*, `💜 Me adicione!`, "💻 Veja meus comandos shelp!", "💸 Aposte com seus amigos!"*/];
let index = 0;

client.on('ready', () => {
    console.log(`Bot [${client.user.username}] online com sucesso!`);
    setInterval(() => {
        const status = client.user.setPresence({
            status: 'idle',
            activities: [{
                type: ActivityType.Custom,
                name: list(client)[index]
            }]
        })
        index++;
        if (index >= list(client).length) index = 0;
    }, 12_000);
});
