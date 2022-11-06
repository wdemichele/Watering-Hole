//Tests if the login page can submit form data and return content
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    defaultViewport: {width: 1300, height: 800} 
    ,headless:false,
  });
  //open
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');
  //error
  await page.type("#username", "yijiehuang", {delay: 1});
  await page.type("#password", "123123sss", {delay: 1});
  await page.click('html body div.login.accent div.login-text-field form div button.primary.login-btn');
  await page.screenshot({path: './img/login/error.png'});
  //success
  await page.type("#username", "yijiehuang", {delay: 1});
  await page.type("#password", "123123", {delay: 1});
  await page.click('html body div.login.accent div.login-text-field form div button.primary.login-btn');
  await page.screenshot({path: './img/login/success.png'});
  //close
  await browser.close();
})();