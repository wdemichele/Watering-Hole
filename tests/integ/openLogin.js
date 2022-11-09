//测试登录页面输入正确用户密码进入首页
//
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    defaultViewport: {width: 1300, height: 800} 
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');
  await page.screenshot({path: './img/index.png'});
  await browser.close();
})();