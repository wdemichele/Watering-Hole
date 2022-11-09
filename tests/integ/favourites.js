//Test the contents of the favourites page
const puppeteer = require('puppeteer');

(async () => {
  
  const browser = await puppeteer.launch({
    defaultViewport: {width: 1300, height: 800} 
    ,headless:false,
  });
  
  var username="hahahs";
  var password="12345678";
  var content="sa";

  //open
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');

  //Enter into
  await page.type("#username", username, {delay: 100});
  await page.type("#password", password, {delay: 100});
  await page.click('html body div.login.secondary div.login-text-field form div button.primary.login-btn');
  await page.waitForSelector('html body header nav ul.nav-links li:nth-child(4) a img.nav-icon.filter-white');
 
  //Click on the favourites page in the navigation bar
  await page.click('html body header nav ul.nav-links li:nth-child(4) a img.nav-icon.filter-white');
  await page.waitForSelector('html body div div.search_box div.search_left form div.center input#area_name.search_search.pac-target-input');
  await page.screenshot({path: './img/favourites/page.png'});

  //Enter content into the form
  await page.type("#area_name", content, {delay: 100});
  await page.waitForTimeout(2000);
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await page.waitForSelector('html body div#map div div.gm-style div div');
  await page.waitForTimeout(2000);
  await page.screenshot({path: './img/favourites/show.png'});


  //close
  await browser.close();
})();