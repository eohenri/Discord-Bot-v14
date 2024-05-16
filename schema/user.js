const {
  Schema,
  model
} = require("mongoose");

const userSchema = new Schema({
  _id: { type: String, required: true }, // O ID do usuário Discord
  economia: {
    crime: { type: Number, default: 0 },
    ametistas: { type: Number, default: 0 },
    banco: { type: Number, default: 0 },
  },
  social: {
    energia: { type: Number, default: 0 },
    rep: { type: Number, default: 0 },
    banner: { type: String, default: null },
    friend: { type: String, default: null },
  },
  perfil: {
    insignias: { type: String, default: "⭐" },
    banner: { type: String, default: "https://cdn.discordapp.com/attachments/1132019769260916897/1173446529953042534/4df413311ed3c8c83c3031f24a909f75.jpg?ex=6563fc3e&is=6551873e&hm=0774eb0db5674c8f78f1a8c0156b1dfae9aa98789d2ae20ce26f2da8f9c8357c&" },
    sobremim: {
      type: String, default: "Amigo(a) da StarGaby!"
    },
    idade: { type: String, default: "Não informado" },
  },
  casar: {
    casado: { type: Boolean, default: false },
    com: { type: String, default: "ninguém" },
    tempo: { type: Number, default: 0 },
  },
  blacklist: {
    banido: { type: Boolean, dedault: false },
    motivo: { type: String, default: "Não informado." },
    time: { type: Number, default: 0 },
  },
  pet: {
    namepet: { type: String, default: "Nenhum" },
    vida: { type: Number, default: 100 },
    xppet: { type: Number, defalt: 0 },
    cuidadores: { type: String, default: "Nenhuma pessoa cuidando desse pet" },
  },
  premium: {
    vip: { type: Boolean, default: false },
    viptime: { type: Number, default: 0 },
  },
  cooldowns: {
    daily: { type: Number, default: 0 },
    work: { type: Number, default: 0 },
    rep: { type: Number, default: 0 },
    crime: { type: Number, default: 0 },
    semanal: { type: Number, default: 0 },
    pescar: { type: Number, default: 0 },
    colher: { type: Number, default: 0 },
    assalto: { type: Number, default: 0 },
    mensal: { type: Number, default: 0 },
    lavagem: { type: Number, default: 0 },
    carro: { type: Number, default: 0 },
    topgg: { type: Number, default: 0 },
    booster: { type: Number, default: 0 },
    fofoca: { type: Number, default: 0 },
    gf: { type: Number, default: 0 }
  },
  farm: {
    batata: { type: Number, default: 0 },
    milho: { type: Number, default: 0 },
    arroz: { type: Number, default: 0 },
    feijao: { type: Number, default: 0 },
    cenoura: { type: Number, default: 0 },
    beterraba: { type: Number, default: 0 },
  },
  afk: {
    ativo: { type: Boolean, default: false },
    motivo: { type: String, default: "Não informado." },
    tempo: { type: Number, default: 0 },
  },
  inv: {
    vara: { type: Number, default: 0 },
    arma: { type: Number, default: 0 },
    colete: { type: Number, default: 0 },
    picareta: { type: Number, default: 0 },
  },
  coinflip: {
    vitoria: { type: Number, default: 0 },
    derrota: { type: Number, default: 0 },
  }
});

module.exports = model('Usuários', userSchema);
