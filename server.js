//Created by: Byron Georgopoulos
//Created on: 25/08/2020
//Last Updated on: 08/09/2020
//Created for: HyperionDev - L02T21: Capstone II (Full-Stack Web-Development Bootcamp)
//Description: This is the Express Server of my Full-Stack Express & React Web App that uses the iTunes API.

//Require Express & Node.js File System Module, & Helmet 
const express = require('express');
const helmet = require('helmet');
const app = express();
const fetch = require('isomorphic-fetch');
const path = require('path');

//Require Body-Parser Middleware
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Use Helmet
app.use(helmet());

//Use the search API from the React App to search the iTunes API and return the results
app.post('/userSearch', (req, res) => {
let apiURL = req.body.apiURL
fetch(`${apiURL}`)
    .then(res => res.json())
    .then(
        (result) => {
            res.json(result);
        },
        (error) => {
            res.send(error);
        }
    )
});

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'build')));
    app.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, 'build', 'index.html'));
    });

}

//Express App is listening on PORT 3001 (React App on PORT 3000)
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});