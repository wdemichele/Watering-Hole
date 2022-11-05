//Test the contents of the home page
const puppeteer = require('puppeteer');

(async () => {
  
  const browser = await puppeteer.launch({
    defaultViewport: {width: 1300, height: 800} 
    ,headless:false,
  });

  var username="hahahs";
  var password="12345678";

  //open
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');

  //Enter into
  await page.type("#username", username, {delay: 100});
  await page.type("#password", password, {delay: 100});
  await Promise.all([
    page.click('html body div.login.accent div.login-text-field form div button.primary.login-btn'),
    page.waitForSelector('html body div.databox.secondary div.flex-container div.databox.primary div.friend-container a h2'), // 等待页面跳转
  ]);
  await page.screenshot({path: './img/home/page.png'});

  //click Friend Activity
  await Promise.all([
    page.click('html body div.databox.secondary div.flex-container div.databox.primary div.friend-container a h2'),
  ]);
  await page.screenshot({path: './img/home/clickFrend.png'});
  
  //close
  await browser.close();
})();