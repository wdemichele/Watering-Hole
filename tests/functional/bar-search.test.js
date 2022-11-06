const reformat = require("../../functions/query-reformat")
const axios = require('axios').default;
const request = require('supertest')
const req = require('express/lib/request');
const res = require('express/lib/response');
const { text } = require('body-parser');
axios.get('/user?ID=12345')
jest.mock("axios");

function remove_extra_characters(query) {
    query = query.replace(/ /gi, "%20");
    query = query.replace(/,/g, '');
    return query;
}

describe('Sanity test', () => {
    test('1 should equal 1', () => {
      expect(1).toBe(1)
    })
  })

describe ('Charecter encoding and unnecesary character removal', () => {
    test('should encode all the white spaces', async () => {
        var text = "yah yahs Melbourne";
        const result = reformat(text);
        //const result = "abc";
        console.log(text + " => " + result);
        expect(result).toBe("yah%20yahs%20Melbourne");
    })
    test('should remove commas', async () => {
        var text = "yah yahs, Melbourne";
        const result = reformat(text);
        //const result = "abc";
        console.log(text + " => " + result);
        expect(result).toBe("yah%20yahs%20Melbourne");
    })
    test('should remove extra whitespaces', async () => {
        var text = "yah   yahs     Melbourne   ";
        const result = reformat(text);
        //const result = "abc";
        console.log(text + " => " + result);
        expect(result).toBe("yah%20yahs%20Melbourne");
    })
    test('should remove special characters', async () => {
        var text = "=yah yahs Melbourne##??_//";
        const result = reformat(text);
        //const result = "abc";
        console.log(text + " => " + result);
        expect(result).toBe("yah%20yahs%20Melbourne");
    })
})


//test
// , async () await post