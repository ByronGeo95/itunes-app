//Created by: Byron Georgopoulos
//Created on: 11/09/2020
//Last Updated on: 11/09/2020
//Created for: HyperionDev - L02T21: Capstone II (Full-Stack Web-Development Bootcamp)
//Description: This is the Express Unit Test of my Full-Stack Express & React Web App that uses the iTunes API. 
//             It tests that the Fetch API returns the correct number of results (key: "resultCount" in the .JSON file returned by the iTunes Search API).

const express = require('express');
const helmet = require('helmet');
const app = express();
const fetch = require('isomorphic-fetch');
const bodyParser = require('body-parser');
const chai = require('chai');
const expect = chai.expect;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());

let actual;
let expected = 25;

describe('Return correct search result limit from iTunes Search API', () => {
    it('should return 25', async () => {
        await fetch('https://itunes.apple.com/search?term=jack+johnson&limit=25')
        .then(res => res.json())
        .then(
            (result) => {
                actual = result.resultCount;
            },
            (error) => {
                console.log('ERROR: ' + error);
            }
        )
        expect(actual).to.equal(expected);
    });
});