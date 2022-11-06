//jest.useFakeTimers();
const puppeteer = require('puppeteer');

test('validate', async () => {
    const browser = await puppeteer.launch({});
    const page = await browser.newPage();
    await page.goto('https://joel.tools/merch/');
    await page.screenshot({path : './demo.png'});

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

