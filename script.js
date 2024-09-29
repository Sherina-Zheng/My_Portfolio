console.log ("Hello World")

let user = prompt ("Enter Your Name");


// Practice conditional statement in class
let score = prompt("What is your score?")

if (score >= 90) {
    alert('Your grade is A.')
}
else if (score >=80 && score <90) {
    alert('Your grade is B.')
}
else if(score >=70 && score <80) {
    alert('Your grade is C.')
}
else {
    alert('Unfortunately, You Failed.')
}

console.log (score)

// Practice in function 
let name = prompt('Please enter your name here.');
let age = prompt('Please enter your age here.');

function introduction (name, age) {

    alert(`Hello, my name is ${name} and I am ${age} years old.`)
}

introduction(name, age)