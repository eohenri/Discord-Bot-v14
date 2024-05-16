const {
    Schema,
    model
} = require("mongoose");
const lotterySchema = new Schema(
    {
        docId: { type: String },
        status: { type: Boolean, default: false },
        users: { type: Array, default: [] },
        lastSort: { type: Number, default: 0 },
        winners: { type: Array, default: [] },
        winner_old: { type: String, default: "desconhecido!" },
        cooldown: { type: Number, default: 0 },
    }
);
const lotterySave = model('loteria', lotterySchema);
module.exports = lotterySave;