const ejs = require('ejs');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs')
const { url, cookieContent, delayTime, templatePath, outputPatch } = require('./confg.js');
const data = []
// 1. 获取html

async function getHtml(url) {
  return axios.get(url, {
    cookie: cookieContent
  })
}

function delay(promise, time) {
  return new Promise((resolve, reject) => {
    return promise.then(() => {
      setTimeout(() => {
        resolve();
      }, time)
    })

  })
}

function parseHtml(html) {
  const $ = cheerio.load(html);
  const contents = $('.first_category li');
  let promise = Promise.resolve();
  for (let a = 0; a < contents.length; a++) {
    promise = promise.then(() => {
      const content = $(contents[a]);
      const temp = {
        name: content.attr('title'),
        tags: []
      }
      data.push({
        ...temp
      })
      const promises = [];
      console.log(`抓取${temp.name}`)
      $('.second_category').eq(a).find('.second_block').toArray().forEach((content, idx) => {
        content = $(content)
        const temp1 = {
          classify: content.find('.second_title').text(),
          items: []
        }
        temp.tags.push({ ...temp1 })
        content.find('li').toArray().forEach((li, idx) => {
          li = $(li);
          const id = li.attr('id');
          const text = li.text();
          promises.push(
            delay(axios.get(`http://hungry-english.com/api/v1/collocation/${id}/`, {
              cookie: cookieContent
            }).then(({ data }) => {
              console.log(`抓取${temp.name}下的${text}完成`)
              temp1.items[idx] = {
                name: text,
                content: data.content
              }
            }), delayTime)
          )
        })
      })
      return Promise.all(promises)

    }).catch(e => {
      console.log(e)
    })
  }
  return promise
}



async function start() {
  const { data: html } = await getHtml(url);
  await parseHtml(html);
  ejs.renderFile(templatePath, {
    data
  }, {}, function (err, str) {
    if (fs.existsSync(outputPatch)) {
      fs.unlinkSync(outputPatch)
    }
    fs.writeFileSync(outputPatch, str);

  });
}
start()






