// 1 - function for find min number
function findMin(num1, num2) {
    if (Number.isNaN(num1) || Number.isNaN(num2)) {
        return ({error: "Please enter valid numbers"});
    }
    else {
        if (num1 > num2) {
            return ({ans: `Number 2 is min: ${num2}`})
        }
        else {
            return ({ans: `Number 1 is min: ${num1}`})
        }
    }
}

// 2 - function for find max number
function findMax(num1, num2) {
    if (Number.isNaN(num1) || Number.isNaN(num2)) {
        return ({error: "Please enter valid numbers"});
    }
    else {
        if (num1 > num2) {
            return ({ans: `Number 1 is the max: ${num1}`})
        }
        else {
            return ({ans: `Number 2 is the max: ${num2}`})
        }
    }
}

// 3 - function for find average of numbers
function findAvg(numbers) {
    const inputs = numbers.split(',');
    const length = Object.keys(inputs).length;
    let avg = 0;
    let output = "";

    for (let key in inputs) {
        if (isNaN(inputs[key])) {
            return ({error: "Please enter valid number list"});
        }
        else {
            inputs[key] = parseFloat(inputs[key]);
            avg += inputs[key] / length;
        }
    }

    return({avg: `Average of given numbers: ${avg}`});
}

// 4 - function for find sort numbers
function sortNumbers(numbers, type) {
    const inputs = numbers.split(',');

    for (let key in inputs) {
        if (isNaN(inputs[key])) {
            return ({error: "Please enter valid number list"});
        }
        else {
            inputs[key] = parseFloat(inputs[key]);
        }
    }

    if (type == "asc") {
        const sorted_asc = inputs.sort((a, b) => a - b);

        return ({sorted: `Sorted in ascending order: ${sorted_asc}`});
    }
    else if(type == "dec") {
        const sorted_dec = inputs.sort((a, b) => b - a);

        return ({sorted: `Sorted in descending order: ${sorted_dec}`});
    }
    else {
        return ({error: "Please enter valid sorting type"});
    }
}

// exporting functions
module.exports = { findMin, findMax, findAvg, sortNumbers };