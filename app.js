require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const PORT = 3000;
const Discord = require('discord.js');
const indexRouter = require('./routes/index');
const userModel = require('./schema/user');
const inputMsg = '!입력모드';
const http = require('http');

setInterval(function () {
  http.get('https://discordschedules.herokuapp.com/');
}, 1800000);

mongoose
  .connect(
    `mongodb+srv://hoya:${process.env.PW}@hoyadiscordschedule.pqeqbgv.mongodb.net/?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log('MongoDB connected...'))
  .catch((error) => console.log(error));

const client = new Discord.Client({ intents: ['GUILDS', 'GUILD_MESSAGES'] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', (msg) => {
  if (msg.content === '!호야사진줘') {
    const randomNumber = Math.floor(Math.random() * 22);
    const file = new Discord.MessageAttachment(`./images/hoya_${randomNumber}.jpg`);
    const embed = new Discord.MessageEmbed().setTitle('image').setImage('attachment://discordjs.png');

    msg.channel.send({ embeds: [embed], files: [file] });

    return;
  }

  // if (msg.content.includes(inputMsg) || msg.content.indexOf(inputMsg) === 0) {
  //   const bodyMsg = msg.content.substring(5);

  //   msg.channel.send('저장이 완료되었습니다.');
  // }

  // if (msg.content === '!저장') {
  //   let user = new userModel();
  //   user.name = '실제 데이터 테스트';
  //   user.schedule = 'Test Schedule';

  //   user
  //     .save()
  //     .then((result) => {
  //       console.log(result);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }
});

client.login(process.env.BOT_TOKEN);

app.use('/', indexRouter);

app.get('/', (req, res) => res.send('Hoya discord!'));
app.listen(process.env.PORT || PORT, () => console.log(`Example app listening on port ${PORT}!`));
