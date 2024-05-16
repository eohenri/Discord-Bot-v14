const {
  EmbedBuilder
} = require("discord.js");
const colors = require("../../util/colors");

module.exports = {
  name: 'snake',
  category: "fun",
  aliases: ['cobrinha'],
  run: async (client, message, args) => {
    const { Snake } = require('discord-gamecord');
    const Game = new Snake({
      message: message,
      isSlashGame: false,
      embed: {
        title: 'Snake Game',
        overTitle: 'Fim de jogo..',
        color: colors.purble
      },
      emojis: {
        board: '⬛',
        food: '🍎',
        up: '⬆️',
        down: '⬇️',
        left: '⬅️',
        right: '➡️',
      },
      snake: { head: '🟢', body: '🟩', tail: '🟢', skull: '💀' },
      foods: ['🍎', '🍇', '🍊', '🫐', '🥕', '🥝', '🌽'],
      stopButton: 'Parar',
      timeoutTime: 60000,
      playerOnlyMessage: 'Apenas {player} pode utilizaros botões.'
    });
    Game.startGame();
    Game.on('gameOver', result => {
      console.log(result);  // =>  { result... }
    });
  }
}
