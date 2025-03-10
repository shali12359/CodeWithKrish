const express = require('express');
const { findMin, findMax, findAvg, sortNumbers, searchElement } =  require('./util.js');
const app = new express();
const port = 3000;

const greeting = { message: "Hello Node"};

// greeting endpoint
app.get('/', (req, res) => {
    res.json(greeting);
});

// 1 - find min number endpoint
app.get('/number/min', (req, res) => {
    const num1 = parseFloat(req.query.num1);
    const num2 = parseFloat(req.query.num2);

    let result = findMin(num1, num2);
    res.json(result);
});

// 2 - find max number endpoint
app.get('/number/max', (req, res) => {
    const num1 = parseFloat(req.query.num1);
    const num2 = parseFloat(req.query.num2);

    let result = findMax(num1, num2);
    res.json(result);
});

// 3 - find average of numbers endpoint
app.get('/number/avg', (req, res) => {
    const numbers = req.query.numbers;

    let result = findAvg(numbers);
    res.json(result);
});

// 4 - sort numbers endpoint
app.get('/number/sort', (req, res) => {
    const numbers = req.query.numbers;
    const type = req.query.type;

    let result = sortNumbers(numbers, type);

    res.json(result);
});

// 5 - search element endpoint
app.get('/number/count', (req, res) => {
    const elements = req.query.numbers;
    const keyword = req.query.search;

    console.log(keyword);

    let result = searchElement(elements, keyword);

    res.json(result);
});

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
})
