//Test the functionality of the Query search
const puppeteer = require('puppeteer');
jest.setTimeout(30000);

const username = "esethi";
const password = "password"; 
const url = 'http://localhost:3000';
const browserPath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const path = './tests/integration/Test Output Images/Bucketlist Tests outputs/';
/*
  NOTE:    path can be changed to your browser location
  Unix:    remove path and it will automatically use Chromium
  Windows: Use the location of your Chrome/Chromium browser
*/

describe("validate Query search Results", () => {
    
    test('Add a speficic bar to bucketlist', async () => {
        const browser = await puppeteer.launch( { 
            defaultViewport: {width: 1450, height: 1362, deviceScaleFactor:0.5},
            headless: false,
            executablePath: browserPath });
        const page = await browser.newPage();
        await page.goto(url);
        await page.type("#username", username);
        await page.type("#password", password);
        await page.click('body > div > div > form > div:nth-child(6) > button.primary.login-btn');
        await page.goto(url + '/search/barChIJFd7ppDpo1moREpq8zhmlC4Y');
        await page.click('#bucketlist_button');
        const element = await page.$("#bucketlist_remove");
        const text = await page.evaluate(element => element.textContent, element);
        console.log(text + ' => Remove From Bucketlist');
        await page.screenshot({path : path + 'Bucketlist_0001.png', fullPage: true});
        await page.click('#bucketlist_remove');
        expect(text).toBe('Remove From Bucketlist');
        await browser.close();

    })
    
    test('Remove a speficic bar from bucketlist', async () => {
        const browser = await puppeteer.launch( { 
            defaultViewport: {width: 1450, height: 1362, deviceScaleFactor:0.5},
            headless: false,
            executablePath: browserPath });
        const page = await browser.newPage();
        await page.goto(url);
        await page.type("#username", username);
        await page.type("#password", password);
        await page.click('body > div > div > form > div:nth-child(6) > button.primary.login-btn');
        await page.goto(url + '/search/barChIJFd7ppDpo1moREpq8zhmlC4Y');
        await page.click('#bucketlist_button');
        //remove it after adding it
        await page.click('#bucketlist_remove');
        const element = await page.$("#bucketlist_button");
        const text = await page.evaluate(element => element.textContent, element);
        console.log(text + ' => Add To Bucketlist');
        await page.screenshot({path : path + 'Bucketlist_0002.png', fullPage: true});
        expect(text).toBe('Add To Bucketlist');
        await browser.close();

    })
    
    
    test('Add the first bar to bucketlist after using query search', async () => {
        const browser = await puppeteer.launch( { 
            defaultViewport: {width: 1450, height: 1362, deviceScaleFactor:0.5},
            headless: false,
            executablePath: browserPath });
        const page = await browser.newPage();
        await page.goto(url);
        await page.type("#username", username);
        await page.type("#password", password);
        await page.click('body > div > div > form > div:nth-child(6) > button.primary.login-btn');
        await page.goto(url + '/search/bar-search');
        await page.type('#bar_name', 'bars melbourne cbd');
        await page.click('#query > form > button.primary.right', {
            waitUntil: "domcontentloaded",
          })
        await page.waitForTimeout(2000);
        const handle = await page.$('body > div > div > div.flex-container > div:nth-child(1) > a');
        const Href = await page.evaluate(anchor => anchor.getAttribute('href'), handle);
        //Note: uncomment this line to check if Href is being fetched correctly
        //console.log(Href);
        await page.goto(url + Href);
        await page.click('#bucketlist_button');
        const element = await page.$("#bucketlist_remove");
        const text = await page.evaluate(element => element.textContent, element);
        console.log(text + ' => Remove From Bucketlist');
        await page.screenshot({path : path + 'Bucketlist_0003.png', fullPage: true});
        await page.click('#bucketlist_remove');
        expect(text).toBe('Remove From Bucketlist');
        await browser.close();
    })

    
    test('Remove the first bar from bucketlist after using query search after adding it', async () => {
        const browser = await puppeteer.launch( { 
            defaultViewport: {width: 1450, height: 1362, deviceScaleFactor:0.5},
            headless: false,
            executablePath: browserPath });
        const page = await browser.newPage();
        await page.goto(url);
        await page.type("#username", username);
        await page.type("#password", password);
        await page.click('body > div > div > form > div:nth-child(6) > button.primary.login-btn');
        await page.goto(url + '/search/bar-search');
        await page.type('#bar_name', 'bars melbourne cbd');
        await page.click('#query > form > button.primary.right', {
            waitUntil: "domcontentloaded",
          })
        await page.waitForTimeout(2000);
        const handle = await page.$('body > div > div > div.flex-container > div:nth-child(1) > a');
        const Href = await page.evaluate(anchor => anchor.getAttribute('href'), handle);
        console.log(Href);
        await page.goto(url + Href);
        await page.click('#bucketlist_button');
        //remove it after adding it
        await page.click('#bucketlist_remove');
        const element = await page.$("#bucketlist_button");
        const text = await page.evaluate(element => element.textContent, element);
        console.log(text + ' => Add To Bucketlist');
        await page.screenshot({path : path + 'Bucketlist_0004.png', fullPage: true});
        expect(text).toBe('Add To Bucketlist');
        await browser.close();
    })
    
})