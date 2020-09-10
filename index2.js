let workExperienceDescriptionDiv = document.getElementById('work-experience-description');
let programmingExperienceDescriptionDiv = document.getElementById('programming-experience-description');

let SetDescription = function (descriptionElement, Description) {
    if (descriptionElement.innerHTML === "") {
        descriptionElement.innerHTML = Description;
    } else {
        descriptionElement.innerHTML = ""
    }
}

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
<p align="center">
Several technologies:
</p>
<ul>
    <li>
    Glue: Construction of a Statistical Analysis Pipeline for Firmware Analysis Results
    </li>
    <li>
    ECS: Streaming Data Platform for Statistical Analysis
    </li>
</ul>
`;

let finiteStateHoverable = document.getElementById('fs-hoverable');
finiteStateHoverable.addEventListener('click', SetDescription.bind(this, workExperienceDescriptionDiv, fsDescription));

let awsHoverable = document.getElementById('aws-hoverable');
awsHoverable.addEventListener('click', SetDescription.bind(this, programmingExperienceDescriptionDiv, awsDescription));