// 1 - function for find min number
function findMin(num1, num2) {
    if (isNaN(num1) || isNaN(num2)) {
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
    // validate whether a number
    if (isNaN(num1) || isNaN(num2)) {
        return ({error: "Please enter valid numbers"});
    }
    else {
        // check max number
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
    // split number list by ,
    const inputs = numbers.split(',');
    // store length of numbers
    const length = Object.keys(inputs).length;
    let avg = 0;

    // loop through number list
    for (let key in inputs) {
        // validate whether a number
        if (isNaN(inputs[key])) {
            return ({error: "Please enter valid number list"});
        }
        else {
            // convert string values into float
            inputs[key] = parseFloat(inputs[key]);
            // calculate average
            avg += inputs[key] / length;
        }
    }

    return({avg: `Average of given numbers: ${avg}`});
}

// 4 - function for sort numbers
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

    // check sorting type
    if (type == "asc") {
        // call bubble sort function to sort
        const sorted_asc = bubbleSort(inputs, type);

        return ({sorted: `Sorted in ascending order: ${sorted_asc}`});
    }
    else if(type == "dec") {
        const sorted_dec = bubbleSort(inputs, type);

        return ({sorted: `Sorted in descending order: ${sorted_dec}`});
    }
    else {
        return ({error: "Please enter valid sorting type"});
    }
}

// 5 - function for search given element
function searchElement(elements, keyword) {
    const inputs = elements.split(',');
    // variable to store occurence
    var occurance = 0;

    // check keyword presents
    if (keyword) {
        // loop through the element list
        for (let i = 0; i < inputs.length; i++) {
            // check element occurance
            if (inputs[i] === keyword) {
                occurance++;
            }
        }

        return ({sorted: `Element occured in : ${occurance} times`});
    }
    else {
        return ({error: "Please enter valid search keyword"});
    }
}

// bubble sort algo for sorting numbers
function bubbleSort(arr, type) {
    // loop through the elements
    for (var i = 0; i < arr.length; i++) { 
        for (var j = 0; j < (arr.length - i - 1); j++) {
            // check sort type & do the sorting
            if (type === 'asc') {
                if (arr[j] > arr[j + 1]) {
                    var temp = arr[j]
                    arr[j] = arr[j + 1]
                    arr[j + 1] = temp
                }
            }
            else if (type === 'dec') {
                if (arr[j] < arr[j + 1]) {
                    var temp = arr[j]
                    arr[j] = arr[j + 1]
                    arr[j + 1] = temp
                }
            }
        }
    }

    return arr;
}

// exporting functions
module.exports = { findMin, findMax, findAvg, sortNumbers, searchElement };