//Test the functionality of the User authentication
const puppeteer = require('puppeteer');
jest.setTimeout(30000);

const username = "esethi";
const password = "password"; 
const url = 'http://localhost:3000';
const browserPath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const path = './tests/functional/test output images/User Authentication/';
/*
  NOTE:    path can be changed to your browser location
  Unix:    remove path and it will automatically use Chromium
  Windows: Use the location of your Chrome/Chromium browser
*/

describe("valid user authentication", () => {
    
    test('valid user credentials', async () => {
        
        const browser = await puppeteer.launch( { 
            defaultViewport: {width: 1450, height: 928},
            headless: false,
            executablePath: browserPath });
        const page = await browser.newPage();
        await page.goto(url);
        await page.type("#username", username);
        await page.type("#password", password);
        await page.click('body > div > div > form > div:nth-child(6) > button.primary.login-btn');
        var currentUrl = page.url();
        console.log('expected url: http://localhost:3000/home \n current url: '+ currentUrl);
        expect(currentUrl).toBe("http://localhost:3000/home");
        await page.screenshot({path : path + 'valid credentials.png', fullPage: true});
        await browser.close();

    })
    test('invalid user password', async () => {
        
        const browser = await puppeteer.launch( { 
            defaultViewport: {width: 1450, height: 1362},
            headless: false,
            executablePath: browserPath });
        const page = await browser.newPage();
        await page.goto(url);
        await page.type("#username", username);
        await page.type("#password", '1234');
        await page.click('body > div > div > form > div:nth-child(6) > button.primary.login-btn');
        var currentUrl = page.url();
        await page.type("#username", username);
        await page.type("#password", '1234');
        console.log('expected url: http://localhost:3000/ \n current url: '+ currentUrl);
        expect(currentUrl).toBe("http://localhost:3000/");
        await page.screenshot({path : path + 'invalid user password.png'});
        await browser.close();

    })
    
    test('invalid user id', async () => {
        
        const browser = await puppeteer.launch( { 
            defaultViewport: {width: 1450, height: 1362},
            headless: false,
            executablePath: browserPath });
        const page = await browser.newPage();
        await page.goto(url);
        await page.type("#username", 'invalid');
        await page.type("#password", password);
        await page.click('body > div > div > form > div:nth-child(6) > button.primary.login-btn');
        var currentUrl = page.url();
        await page.type("#username", 'invalid');
        await page.type("#password", password);
        console.log('expected url: http://localhost:3000/ \n current url: '+ currentUrl);
        expect(currentUrl).toBe("http://localhost:3000/");
        await page.screenshot({path : path + 'invalid user id.png'});
        await browser.close();

    })
    
    
})

