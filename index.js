const {
  EmbedBuilder,
  Client,
  IntentsBitField,
  Partials,
  InteractionType,
  Collection
} = require('discord.js');
const fs = require('fs');
const mg = require("mongoose");
require("dotenv").config();

const client = new Client({
  intents: [1, 2, 128, 512, 32768,
    IntentsBitField.Flags.DirectMessages,
    IntentsBitField.Flags.GuildInvites,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessageReactions,
    IntentsBitField.Flags.GuildEmojisAndStickers
  ],
  partials: [
    Partials.User,
    Partials.Message,
    Partials.Reaction,
    Partials.Channel,
    Partials.GuildMember
  ]
});

client.slashCommands = new Collection();
client.comandos = new Collection();
module.exports = client
fs.readdir('./events', (err, file) => {
  for (let evento of file) {
    require(`./events/${evento}`)
  }
})
fs.readdir('./handlers', (err, file) => {
  for (let main of file) {
    require(`./handlers/${main}`)
  }
})
mg.connect(process.env.MONGO);
mg.connection.on('connected', () => {
  console.log('Conexão com o MongoDB estabelecida com sucesso.');
});
mg.connection.on('error', (err) => {
  console.error('Erro na conexão com o MongoDB:', err);
});
client.once("ready", () => {
  console.log("Online chefinho!");
  setInterval(() => {
    require("./events/lottery.js")(client);
  }, 60000);
});

client.login(process.env.TOKEN); //Token no arquivo .env mel!

process.on("unhandRejection", (reason, promise) => console.log(reason));
process.on("uncaughtException", (error, origin) => console.log(error, origin));
