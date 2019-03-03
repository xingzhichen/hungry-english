const ejs = require('ejs');
const axios = require('axios');
const cheerio = require('cheerio')
const path = require('path')
const filePath = path.resolve('./template.ejs');
console.log(filePath);
const { url, cookieContent } = require('./confg.json');
const data = []
// 1. 获取html

async function getHtml(url) {
  return axios.get(url, {
    cookie: cookieContent
  })
}

function parseHtml(html) {
  const $ = cheerio.load(html);
  const contents = $('.first_category li');
  let promise = Promise.resolve();
  for (let a = 0; a < 1; a++) {
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
      $('.second_category').eq(a).find('.second_block').toArray().forEach((content, idx) => {
        content = $(content)
        const temp1 = {
          classify: content.find('.second_title').text(),
          items: []
        }
        temp.tags.push({ ...temp1 })
        content.find('li').toArray().forEach((li) => {
          li = $(li);
          const id = li.attr('id');
          const text = li.text();
          promises.push(
            axios.get(`http://hungry-english.com/api/v1/collocation/${id}/`, {
              cookie: cookieContent
            }).then(({ data }) => {
              temp1.items.push({
                name: text,
                content: data
              })
            })
          )
        })
      })
      return Promise.all(promises)

    })
  }
  return promise
}



async function start() {
  const { data: html } = await getHtml(url);
  await parseHtml(html);
  ejs.renderFile(filePath, data, {}, function (err, str) {
    console.log(str)
  });
}






