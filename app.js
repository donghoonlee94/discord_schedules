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

const updateScheduleMsg = '!스케줄수정';
const getAllScheduleList = '!모든스케줄조회';
const getScheduleMsg = '!스케줄조회';
const getUserListMsg = '!등록된멤버조회';
const scheduleBotGuideMsg = '!호야봇가이드';

const userList = ['동훈', '예경', '진욱', '창섭', '유저', '유진', '듀니', '코즈'];

const updateScheduleUserMsg = {
  '!스케줄수정:동훈': '동훈',
  '!스케줄수정:예경': '예경',
  '!스케줄수정:진욱': '진욱',
  '!스케줄수정:창섭': '창섭',
  '!스케줄수정:유저': '유저',
  '!스케줄수정:유진': '유진',
  '!스케줄수정:듀니': '듀니',
  '!스케줄수정:코즈': '코즈',
};

const getScheduleUserMsg = {
  '!스케줄조회:동훈': '동훈',
  '!스케줄조회:예경': '예경',
  '!스케줄조회:진욱': '진욱',
  '!스케줄조회:창섭': '창섭',
  '!스케줄조회:유저': '유저',
  '!스케줄조회:유진': '유진',
  '!스케줄조회:듀니': '듀니',
  '!스케줄조회:코즈': '코즈',
};

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
  if (msg.content.includes(updateScheduleMsg) || msg.content.indexOf(updateScheduleMsg) === 0) {
    Object.entries(updateScheduleUserMsg).forEach(([key, value]) => {
      if (msg.content.indexOf(key) === 0) {
        const bodyMsg = msg.content.replace(key, '');
        const updateAt = new Date(+new Date() + 3240 * 10000).toISOString().split('T')[0];
        console.log('updateAt', updateAt);
        userModel.updateOne({ name: value }, { schedule: bodyMsg.trim(), updateAt }).then(() => {
          msg.channel.send(`${value}님 스케줄이 수정되었습니다.`);
        });
      }
    });

    return;
  }

  if (msg.content.includes(getScheduleMsg) || msg.content.indexOf(getScheduleMsg) === 0) {
    Object.entries(getScheduleUserMsg).forEach(([key, value]) => {
      if (msg.content.indexOf(key) === 0) {
        userModel.findOne({ name: { $eq: value } }).then((result) => {
          msg.channel.send(`${value}님 스케줄 : ${result.schedule} \r수정일: ${result.updateAt}`);
        });
      }
    });

    return;
  }

  if (msg.content === scheduleBotGuideMsg) {
    msg.channel.send(
      '전체 스케줄 조회: !모든스케줄조회\r개인 스케줄 조회: !스케줄조회:이름\r스케줄 수정: !스케줄수정:이름\r랜덤 호야 사진 얻기: !호야사진줘\r스커 숙코 드립: !스커님숙코에요?\r등록된 멤버 목록 조회: !등록된멤버조회'
    );
    return;
  }

  if (msg.content === getUserListMsg) {
    msg.channel.send(`등록된 멤버는 ${userList.join(',')}(으)로 총 ${userList.length}명 입니다`);
    return;
  }

  if (msg.content.includes(getAllScheduleList)) {
    userModel.find({}, { _id: 0, __v: 0 }).then((result) => {
      result.forEach((user) => {
        msg.channel.send(`User: ${user.name}, Schedule: ${user.schedule}`);
      });
    });
    // console.log('allSchedule', allSchedule);

    // msg.channel.send(allSchedule);
    return;
  }

  if (msg.content === '!호야사진줘') {
    const randomNumber = Math.floor(Math.random() * 22);
    const file = new Discord.MessageAttachment(`./images/hoya_${randomNumber}.jpg`);
    const embed = new Discord.MessageEmbed().setTitle('image').setImage('attachment://discordjs.png');

    msg.channel.send({ embeds: [embed], files: [file] });

    return;
  }

  if (msg.content === '!스커님숙코에요?') {
    const file1 = new Discord.MessageAttachment(`./images/스커_1.png`);
    const file2 = new Discord.MessageAttachment(`./images/스커_2.png`);
    const embed = new Discord.MessageEmbed().setTitle('누가 숙코인가').setImage('attachment://discordjs.png');

    msg.channel.send({ embeds: [embed], files: [file1, file2] });

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
