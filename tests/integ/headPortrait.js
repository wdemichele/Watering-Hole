//Test the contents of the headPortrait List
const puppeteer = require('puppeteer');

(async () => {
  
  const browser = await puppeteer.launch({
    defaultViewport: {width: 1300, height: 800} 
    ,headless:false,
  });
  
  var username="hahahs";
  var password="12345678";
  var newpassword="2345667788";
  var bio="testBio";

  //open
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');

  //Enter into
  await page.type("#username", username, {delay: 100});
  await page.type("#password", password, {delay: 100});
  await page.click('html body div.login.secondary div.login-text-field form div button.primary.login-btn');
  await page.waitForSelector('html body header div.nav-links.right ul div.dropdown img.nav-icon.dropbtn');
  
  //click head Protrait
  await page.click('html body header div.nav-links.right ul div.dropdown img.nav-icon.dropbtn');
  await page.screenshot({path: './img/headPortrait/clickProtrait.png'});
  //Click on the Profile option
  await page.click('html body header div.nav-links.right ul div.dropdown div#myDropdown.dropdown-content.show li a');
  await page.waitForSelector('html body div.databox.primary h3');
  await page.screenshot({path: './img/headPortrait/Profile.png'});
  
  


  
  //Click on the Settings option
  await page.click('html body header div.nav-links.right ul div.dropdown img.nav-icon.dropbtn');
  await page.click('html body header div.nav-links.right ul div.dropdown div#myDropdown.dropdown-content.show li:nth-child(2) a');
  await page.waitForSelector('html body div section div div form div div input#name');
  await page.screenshot({path: './img/headPortrait/Settings.png'});
  //Modify personal information on the setting page
  await page.type("#bio", bio, {delay: 100});
  await page.type("#user_password", newpassword, {delay: 100});
  await page.type("#user_password_confirmation", newpassword, {delay: 100});
  await page.type("#user_current_password", password, {delay: 100});
  await page.screenshot({path: './img/headPortrait/settingContent.png'});
  await page.click('html body div section div div form div div div button');
  await page.waitForSelector('html body div section div div form div div input#name');
  await page.screenshot({path: './img/headPortrait/settingSave.png'});



  //Click on the Logout option
  await page.click('html body header div.nav-links.right ul div.dropdown img.nav-icon.dropbtn');
  await page.click('html body header div.nav-links.right ul div.dropdown div#myDropdown.dropdown-content.show li:nth-child(3) a');
  await page.waitForSelector('html body div.login.accent div.login-text-field form div.login-admin-container a.forgot-pass label');
  await page.screenshot({path: './img/headPortrait/Logout.png'});

  //close
  await browser.close();
})();