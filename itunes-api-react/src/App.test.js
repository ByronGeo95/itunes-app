//Created by: Byron Georgopoulos
//Created on: 11/09/2020
//Last Updated on: 11/09/2020
//Created for: HyperionDev - L02T21: Capstone II (Full-Stack Web-Development Bootcamp)
//Description: This is the React Snapshot Test of my Full-Stack Express & React Web App that uses the iTunes API.

import React from 'react';
import renderer from 'react-test-renderer';

test('H1 Renders Correctly', () => {
  const tree = renderer
    .create(<h1>iTunes Store API:</h1>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
