//Test the contents of the social page
const puppeteer = require('puppeteer');

(async () => {
  
  const browser = await puppeteer.launch({
    defaultViewport: {width: 1300, height: 800} 
    ,headless:false,
  });
  
  var username="hahahs";
  var password="12345678";
  var newpassword="2345667788";
  var trueFriend="yijiehuang";
  var falseFriend="sasdasdasd";

  //open
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');

  //Enter into
  await page.type("#username", username, {delay: 100});
  await page.type("#password", password, {delay: 100});
  await page.click('html body div.login.secondary div.login-text-field form div button.primary.login-btn');
  await page.waitForSelector('html body header nav ul.nav-links li:nth-child(3) a img.nav-icon.filter-white');
  
  //Click on the Social page in the navigation bar
  await page.click('html body header nav ul.nav-links li:nth-child(3) a img.nav-icon.filter-white');
  await page.waitForSelector('html body div.flex-container div.databox.primary a button.secondary.center');
  await page.screenshot({path: './img/social/page.png'});
  
  //Open the Add Social page
  await page.click('html body div.flex-container div.databox.primary a button.secondary.center');
  await page.waitForSelector('html body div.flex-container.databox.secondary div form input');
  await page.screenshot({path: './img/social/addSocial.png'});

  // //Enter the correct user name to add a friend
  // await page.type("html body div.flex-container.databox.secondary div form input", trueFriend, {delay: 100});
  // await page.click('html body div.flex-container.databox.secondary div form button.primary');
  // await page.waitForSelector('html body div.flex-container.databox.secondary div form input');
  // await page.screenshot({path: './img/social/addSuccess.png'});

  // //An error message is displayed when an incorrect user name is entered
  // await page.type("html body div.flex-container.databox.secondary div form input", falseFriend, {delay: 100});
  // await page.click('html body div.flex-container.databox.secondary div form button.primary');
  // await page.screenshot({path: './img/social/addError.png'});


  //close
  await browser.close();
})();