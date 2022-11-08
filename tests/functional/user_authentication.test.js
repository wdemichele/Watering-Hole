//jest.useFakeTimers();
const puppeteer = require('puppeteer');
jest.setTimeout(30000);

const username = "esethi";
const password = "password"; 
/*
describe("validate user authentication", () => {
    test('validate', async () => {
        const browser = await puppeteer.launch( { 
            defaultViewport: {width: 1450, height: 1362},
            headless: false,
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' });
        const page = await browser.newPage();
        await page.goto('http://localhost:3000');
        await page.type("#username", username);
        await page.type("#password", password);
        await page.click('body > div > div > form > div:nth-child(6) > button.primary.login-btn');
        //await page.goto('http://localhost:3000/search/bar-search')
        //await page.type("#bar_name", 'bars melbourne cbd');
        //await page.click('#query > form > button');
        //await page.waitForNavigation();
        await page.waitForTimeout(2000);
        await page.screenshot({path : './demo.png'});
        const price = "$50"; //await page.$eval('.price', div => div.textContent);
        console.log(price);
        expect(price).toBe("$50");
        await browser.close();

    })
})
*/
const url = 'http://localhost:3000';
const browserPath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const path = './tests/functional/test output images/User Authentication/';
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
        //page.waitForFrame(5000);
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
/*
(async () => {
   
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://joel.tools/merch/');
    await page.screenshot({path : './demo.png'});
    const price = await page.$eval('.price', div => div.textContent);
    console.log(price);
    await browser.close();

    
    const url = 'https://demo-navy-one.vercel.app/';
    describe('Example', () => {
        beforeEach(async () => {
            await page.goto(url);
        });
        it('should have the correct title', async () => {
            await expect(page.title()).resolve.toBe('Example Website');
        });
    });
})();
*/

