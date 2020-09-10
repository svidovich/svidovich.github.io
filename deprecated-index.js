// Function to modify visibility of an element. We do this using the
// display:block and display:none styles.
let HandleSetVisibility = function (element) {
    if (element.style.display === 'block') {
        element.style.display = 'none';
        console.log("Set display:none");
    } else {
        element.style.display = 'block';
        console.log("Set display:block");
    }
}



// Pass parameters to the callback using bind.
let workContent = document.getElementById('work-content');
document.getElementById('work-button').addEventListener('click', HandleSetVisibility.bind(this, workContent));

let programmingContent = document.getElementById('programming-content');
document.getElementById('programming-button').addEventListener('click', HandleSetVisibility.bind(this, programmingContent));

let kentStateEducationContent = document.getElementById('education-div-kent-content');
document.getElementById('education-button-kentstate').addEventListener('click', HandleSetVisibility.bind(this, kentStateEducationContent));

let starkStateEducationContent = document.getElementById('education-div-starkstate-content');
document.getElementById('education-button-starkstate').addEventListener('click', HandleSetVisibility.bind(this, starkStateEducationContent));

let stJohnsContent = document.getElementById('stjohns-content');
document.getElementById('stjohns-button').addEventListener('click', HandleSetVisibility.bind(this, stJohnsContent));