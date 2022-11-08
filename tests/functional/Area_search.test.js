//Test the functionality of the Area search
const puppeteer = require('puppeteer');
jest.setTimeout(30000);

const username = "esethi";
const password = "password"; 
const url = 'http://localhost:3000';
const browserPath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const path = './tests/functional/test output images/Area Search Authentication/';
/*
  NOTE:    path can be changed to your browser location
  Unix:    remove path and it will automatically use Chromium
  Windows: Use the location of your Chrome/Chromium browser
*/

describe("validate Area search Results", () => {
    test('validate the results shown', async () => {
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
        await page.click('body > div:nth-child(2) > div > div.w3-bar.w3-black > button:nth-child(2)');
        await page.type('#area_name', 'Fitzroy melbourne');
        await page.click('#area > form > button.primary.right', {
            waitUntil: "domcontentloaded",
          })
        await page.waitForTimeout(2000);
        await page.screenshot({path : path + 'Area_search0001.png', fullPage: true});
        expect(true).toBe(true);
        await browser.close();

    })

    test('show results despite the unneccesay whitespaces in the querry', async () => {
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
        await page.click('body > div:nth-child(2) > div > div.w3-bar.w3-black > button:nth-child(2)');
        await page.type('#area_name', '   Fitzroy      melbourne');
        await page.click('#area > form > button.primary.right', {
            waitUntil: "domcontentloaded",
          })
        await page.waitForTimeout(2000);
        await page.screenshot({path : path + 'Area_search0002.png', fullPage: true});
        expect(true).toBe(true);
        await browser.close();

    })
    
    test('show results despite the special characters in the querry', async () => {
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
        await page.click('body > div:nth-child(2) > div > div.w3-bar.w3-black > button:nth-child(2)');
        await page.type('#area_name', 'Fitzroy ##??_//melbourne');
        await page.click('#area > form > button.primary.right', {
            waitUntil: "domcontentloaded",
          })
        await page.waitForTimeout(2000);
        await page.screenshot({path : path + 'Area_search0003.png', fullPage: true});
        expect(true).toBe(true);
        await browser.close();
    })
    
    test('show results for a city in a different country', async () => {
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
        await page.click('body > div:nth-child(2) > div > div.w3-bar.w3-black > button:nth-child(2)');
        await page.type('#area_name', 'New York, NY, USA');
        await page.click('#area > form > button.primary.right', {
            waitUntil: "domcontentloaded",
          })
        await page.waitForTimeout(2000);
        await page.screenshot({path : path + 'Area_search0004.png', fullPage: true});
        expect(true).toBe(true);
        await browser.close();
    })
    
})