const puppeteer = require('puppeteer');
const { mn } = require('./config/default');
const srcToImg = require('./tool/srcToImg');

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
  await page.click('.s_search');
  console.log('go to search list')

  page.on('load',async () => {
    await page.waitFor(1000)
    console.log('等待页面加载完成')
    
    const srcs = await page.evaluate(() => {
      const images = document.querySelectorAll('img.main_img');
      return Array.prototype.map.call(images, img => img.dataset['imgurl']);
    })
    console.log(`get ${srcs.length} images`)
    console.log(srcs);
    async function saveImg() {
      for (let i = 0; i < srcs.length; i++) {
        console.log(i);
        await page.waitFor(200)
        await srcToImg(srcs[i], mn)
      }
    }
    saveImg()

    await browser.close()

  })
})()