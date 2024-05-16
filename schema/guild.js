const { Schema, model } = require("mongoose");

const guildSchema = new Schema({
  _id: { type: String, required: true }, // O ID do servidor Discord
  prefix: { type: String, default: "s" },
  prefixtester: { type: String, default: "s?" },
  welcomejoin: {
    enable: { type: Boolean, default: false },
    channel: { type: String, default: undefined },
    messageDescription: { type: String, default: undefined },
  },
  autorole: {
    enable: { type: Boolean, default: false },
    roleId: { type: String, default: false },
  },
  tellonym: {
    enable: { type: Boolean, default: false },
    channel: { type: String, default: undefined },
    cooldown: { type: Number, default: 0 },
  }
});

module.exports = model('Servidores', guildSchema);
