const puppeteer = require('puppeteer');
const { mn } = require('./config/default');
const {screenshot} = require('./config/default');

(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('https://image.baidu.com/')
  console.log('go to https://image.baidu.com/')

  // 通过放大屏幕一次能加载更多图片
  await page.setViewport({
    width: 1920,
    height: 1080
  })
  console.log('reset viewport')

  //  模拟鼠标键输入 
  await page.focus('#kw')
  await page.keyboard.sendCharacter('猫')
  await page.click('.s_btn')
  console.log('go to search list')

  page.on('load', () => {
    console.log('等待页面加载完成')
    
  })
  await browser.close()
})()