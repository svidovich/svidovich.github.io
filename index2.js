// Initialize the state of the description frames to empty, because they are
// empty on pageload.
localStorage.setItem('workExperienceDescriptionState', "empty");
localStorage.setItem('programmingExperienceDescriptionState', "empty");
// Get the description divs so that we can fill them with content later.
let workExperienceDescriptionDiv = document.getElementById('work-experience-description');
let programmingExperienceDescriptionDiv = document.getElementById('programming-experience-description');

let SetDescription = function (descriptionElement, stateString, Description) {
    if (localStorage.getItem(stateString) === "empty" || localStorage.getItem(stateString) === null) {
        localStorage.setItem(stateString, "filled");
        descriptionElement.innerHTML = Description;
    } else {
        localStorage.setItem(stateString, "empty");
        descriptionElement.innerHTML = "";
    }
}

// This is why react exists, why people use it, and why I should probably learn it.
fsDescription = `
<div align="center">
June 2018 to Present: Software Engineer / Researcher for Finite State
</div>
<br/>
<div align="center">
In the news
<br/>
<a href="https://finitestate.io/finite-state-supply-chain-assessment/">Huawei Supply Chain Assessment</a>
</div>
<br/>
<div align="center">
Accolades
<br/>
Above & Beyond: Involvement in Huawei Supply Chain Security Assessment, Q2 2019
</div>
<br/>
<div align="center">
Works
</div>
<div class="row">
    <div class="column">
        <div class="gridcontent"><strong>Big Data</strong><br/>Constructed unprecedented statistical analysis pipeline for firmware vulnerability research</div>
        <div class="gridcontent"><strong>Reverse Engineering</strong><br/>Utilized Ghidra&apos;s scripting capabilities for automated binary analysis of arbitrary binaries</div>
        <div class="gridcontent"><strong>Test-Driven Development</strong><br/>Saved development endpoint cost by developing a custom Spark unit testing framework</div>
    </div>
    <div class="column">
        <div class="gridcontent"><strong>Vulnerability Research</strong><br/>Performed and automated vulnerability assessment for linux based firmwares</div>
        <div class="gridcontent"><strong>Vulnerability Disclosures</strong><br/>Involved with research behind 2019 Philips IntelliVue WLAN vulnerability (ICSMA-19-255-01)</div>
        <div class="gridcontent"><strong>Dynamic Analysis</strong><br/>Emulated several IoT devices from firmware for use in dynamic vulnerability research</div>
    </div>
</div>
`;

awsDescription = `
<div align="center">
Works
</div>
<div class="row">
    <div class="column">
        <div class="gridcontent">
            <strong>Glue</strong><br/>Construction of a Statistical Analysis Pipeline on a Massive Parquet Dataset
        </div>
        <div class="gridcontent">
            <strong>SNS & SQS</strong><br/>Triggering of services on ECS & Lambda
        </div>
        <div class="gridcontent">
            <strong>Athena</strong><br/>Advanced queries over Parquet & JSON Datasets with Presto SQL
        </div>
        <div class="gridcontent">
            <strong>Cloudwatch</strong><br/>Dynamic generation of monitoring dashboards
        </div>
    </div>
    <div class="column">
        <div class="gridcontent">
            <strong>ECS</strong><br/> Dynamically Scaling Streaming Data Platform for Statistical Analysis
        </div>
        <div class="gridcontent">
            <strong>Lambda</strong><br/>Periodic Recompute of Large Datasets; Typical Streaming Services
        </div>
        <div class="gridcontent">
            <strong>Cloudformation</strong><br/>Dynamic generation of staging environments for integration testing
        </div>
    </div>
</div>
`;

pythonDescription = `
<div class="row">
    <div class="column">
        <div class="gridcontent">
            <strong>Python</strong><br/>I have used python I swear.
        </div>
    </div>
</div>
`;

let finiteStateHoverable = document.getElementById('fs-hoverable');
finiteStateHoverable.addEventListener('click', SetDescription.bind(this, workExperienceDescriptionDiv, 'workExperienceDescriptionState', fsDescription));

let awsHoverable = document.getElementById('aws-hoverable');
awsHoverable.addEventListener('click', SetDescription.bind(this, programmingExperienceDescriptionDiv, 'programmingExperienceDescriptionState', awsDescription));

let pythonHoverable = document.getElementById('python-hoverable');
pythonHoverable.addEventListener('click', SetDescription.bind(this, programmingExperienceDescriptionDiv, 'programmingExperienceDescriptionState', pythonDescription));