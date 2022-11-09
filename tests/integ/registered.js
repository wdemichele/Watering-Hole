//Tests whether the registered user can successfully register and return to the login page
const puppeteer = require('puppeteer');

(async () => {
  
  const browser = await puppeteer.launch({
    defaultViewport: {width: 1300, height: 800} 
    ,headless:false,
  });
  var name="nameTest";
  var username="hahahsqwcc";
  var password="123456782212";

  //open
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');
  
  //Enter into
  await page.click('html body div.login.secondary div.login-text-field form div.login-admin-container a.forgot-pass p');
  await page.screenshot({path: './img/register/registerPage.png'});
  
  //enter text
  await page.type("#name", name, {delay: 100});
  await page.type("#username", username, {delay: 100});
  await page.type("#password", password, {delay: 100});
  await page.screenshot({path: './img/register/enterText.png'});
  
  //submit
  await page.click('html body div.login.secondary section form div.flex-container button#submit.primary.right');
  await page.screenshot({path: './img/register/SuccessfulRegistration.png'});

  //close
  await browser.close();
})();