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

module.exports = { findMin };