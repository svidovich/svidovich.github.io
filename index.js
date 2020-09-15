// Initialize the state of the description frames to empty, because they are
// empty on pageload.
localStorage.setItem('workExperienceDescriptionState', "empty");
localStorage.setItem('programmingExperienceDescriptionState', "empty");
// Get the description divs so that we can fill them with content later.
let workExperienceDescriptionDiv = document.getElementById('work-experience-description');
let programmingExperienceDescriptionDiv = document.getElementById('programming-experience-description');

// A little bait-and-switch action. Set state based on the description ID, so I can switch back and
// forth between multiple clickables on the page easily.
let SetDescription = (descriptionElement, stateString, Description) => {
    if (localStorage.getItem(stateString) === "empty" || localStorage.getItem(stateString) !== Description.id) {
        console.log(Description.id)
        localStorage.setItem(stateString, Description.id);
        descriptionElement.innerHTML = Description.data;
    } else {
        localStorage.setItem(stateString, "empty");
        descriptionElement.innerHTML = "";
    }
}

// A function that allows me to pull HTML from a given uri.
// Returns a promise that I can then resolve to the data I need.
const GetHTMLFromURI = async (uri) => {
    return new Promise((resolve, reject) => {
        fetch(uri).then(response => { return resolve(response.text()) });
    })
};


let fsDescription = new Object();
fsDescription.id = 'finite-state-description';
GetHTMLFromURI('./assets/elements/finite_state_description.html').then(data => { fsDescription.data = data });
let finiteStateHoverable = document.getElementById('fs-hoverable');
finiteStateHoverable.addEventListener('click', SetDescription.bind(this, workExperienceDescriptionDiv, 'workExperienceDescriptionState', fsDescription));


let awsDescription = new Object();
awsDescription.id = 'aws-description';
GetHTMLFromURI('./assets/elements/aws_description.html').then(data => { awsDescription.data = data });
let awsHoverable = document.getElementById('aws-hoverable');
awsHoverable.addEventListener('click', SetDescription.bind(this, programmingExperienceDescriptionDiv, 'programmingExperienceDescriptionState', awsDescription));


pythonDescription = new Object();
pythonDescription.id = 'python-description';
GetHTMLFromURI('./assets/elements/python_description.html').then(data => { pythonDescription.data = data });
let pythonHoverable = document.getElementById('python-hoverable');
pythonHoverable.addEventListener('click', SetDescription.bind(this, programmingExperienceDescriptionDiv, 'programmingExperienceDescriptionState', pythonDescription));


sparkDescription = new Object();
sparkDescription.id = 'spark-description';
GetHTMLFromURI('./assets/elements/spark_description.html').then(data => { sparkDescription.data = data });
let sparkHoverable = document.getElementById('spark-hoverable');
sparkHoverable.addEventListener('click', SetDescription.bind(this, programmingExperienceDescriptionDiv, 'programmingExperienceDescriptionState', sparkDescription));



// TODOS!
underConstructionDescription = new Object();
underConstructionDescription.id = 'under-construction';
GetHTMLFromURI('./assets/elements/under_construction.html').then(data => { underConstructionDescription.data = data });

pgDescription = new Object();
pgDescription.id = 'pg-description';
GetHTMLFromURI('./assets/elements/postgres_description.html').then(data => {pgDescription.data = data});
let pgHoverable = document.getElementById('pg-hoverable');
pgHoverable.addEventListener('click', SetDescription.bind(this, programmingExperienceDescriptionDiv, 'programmingExperienceDescriptionState', pgDescription));

dockerDescription = new Object();
dockerDescription.id = 'docker-description'
GetHTMLFromURI('./assets/elements/docker_description.html').then(data => {dockerDescription.data = data});
let dockerHoverable = document.getElementById('docker-hoverable');
dockerHoverable.addEventListener('click', SetDescription.bind(this, programmingExperienceDescriptionDiv, 'programmingExperienceDescriptionState', dockerDescription));

linuxDescription = new Object();
linuxDescription.id = 'linux-description'
GetHTMLFromURI('./assets/elements/linux_description.html').then(data => {linuxDescription.data = data});
let linuxHoverable = document.getElementById('linux-hoverable');
linuxHoverable.addEventListener('click', SetDescription.bind(this, programmingExperienceDescriptionDiv, 'programmingExperienceDescriptionState', linuxDescription));
