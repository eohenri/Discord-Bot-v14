const fs = require('fs')
const client = require('../index')

// para carregar uma pastas com subpastas
fs.readdir(`./commands`, (error, folder) => {
  folder.forEach(subfolder => {
    fs.readdir(`./commands/${subfolder}/`, (error, files) => {
      files.forEach(files => {
        if (!files?.endsWith('.js')) return;
        files = require(`../commands/${subfolder}/${files}`);
        if (!files?.name) return;
        client.comandos.set(files?.name, files);
      });
    });
  });
});