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


// exporting functions
module.exports = { findMin, findMax };