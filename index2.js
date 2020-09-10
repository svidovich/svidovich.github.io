// Initialize the state of the description frames to empty, because they are
// empty on pageload.
localStorage.setItem('workExperienceDescriptionState', "empty");
localStorage.setItem('programmingExperienceDescriptionState', "empty");
// Get the description divs so that we can fill them with content later.
let workExperienceDescriptionDiv = document.getElementById('work-experience-description');
let programmingExperienceDescriptionDiv = document.getElementById('programming-experience-description');

// A little bait-and-switch action. Set state based on the description ID, so I can switch back and
// forth between multiple clickables on the page easily.
let SetDescription = function (descriptionElement, stateString, Description) {
    if (localStorage.getItem(stateString) === "empty" || localStorage.getItem(stateString) !== Description.id) {
        console.log(Description.id)
        localStorage.setItem(stateString, Description.id);
        descriptionElement.innerHTML = Description.data;
    } else {
        localStorage.setItem(stateString, "empty");
        descriptionElement.innerHTML = "";
    }
}

// This is why react exists, why people use it, and why I should probably learn it.
fsDescription = {
    id: 'finite-state-description',
    data: `
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
`};

awsDescription = {
    id: 'aws-description',
    data: `
<div align="center">
Amazon Web Services: Works
</div>
<div class="row">
    <div class="column">
        <div class="gridcontent">
            <strong>Glue</strong><br/>Construction of a Statistical Analysis Pipeline on a Massive Parquet Dataset.
        </div>
        <div class="gridcontent">
            <strong>SNS & SQS</strong><br/>Triggering of services on ECS & Lambda.
        </div>
        <div class="gridcontent">
            <strong>Athena</strong><br/>Advanced queries over Parquet, ORC & JSON Datasets with Presto SQL.
        </div>
        <div class="gridcontent">
            <strong>Cloudwatch</strong><br/>Dynamic generation of monitoring dashboards.
        </div>
    </div>
    <div class="column">
        <div class="gridcontent">
            <strong>ECS</strong><br/>Dynamically Scaling Streaming Data Platform for Statistical Analysis.
        </div>
        <div class="gridcontent">
            <strong>Lambda</strong><br/>Periodic Recompute of Large Datasets; Typical Streaming Services.
        </div>
        <div class="gridcontent">
            <strong>Cloudformation</strong><br/>Dynamic generation of staging environments for integration testing.
        </div>
    </div>
</div>
`};

pythonDescription = {
    id: 'python-description',
    data: `
<div align="center">
Pythonic, proven, personal (3P) sample use-cases...
</div>
<div class="row">
    <div class="column">
        <div class="gridcontent">
            <strong>Flask</strong><br/>RESTful APIs, microservices, whatever you like. Used as a front end to a web-scraping pipeline.
        </div>
        <div class="gridcontent">
            <strong>Ariadne</strong><br/>Simple schema-first GraphQL services. Layering on top of flask for a query validation service was my first contact.
        </div>
        <div class="gridcontent">
            <strong>boto3</strong><br/>The 'full-stack' experience, from IaaS to containerized services. Have used it to control all of the cases -- and more -- found in the 'AWS' section.
        </div>
        <div class="gridcontent">
            <strong>SQLite</strong><br/>Used for lightweight web services that can run containerized, sometimes as a cache.
        </div>
    </div>
    <div class="column">
        <div class="gridcontent">
            <strong>numpy</strong><br/>Numerical Analysis, Mathematical modeling & Data Exploration to supplement later Apache Spark data pipeline construction.
        </div>
        <div class="gridcontent">
            <strong>Django</strong><br/>Used for production database construction, migration & management.
        </div>
        <div class="gridcontent">
            <strong>Jupyter</strong><br/>Prototyping PySpark code on sample datasets before introduction to production Spark pipeline environments.
        </div>
    </div>
</div>
`};

sparkDescription = {
    id: 'spark-description',
    data: `
<div align="center">
Production Realtime & Batch: My Experiences
</div>
<div class="row">
    <div class="column">
        <div class="gridcontent">
            <strong>Analytics</strong><br/>Construction of a world-class firmware-analytic statistical analysis batch-work pipeline through AWS Glue.
        </div>
        <div class="gridcontent">
            <strong>Risk Enumeration</strong><br/>Market-leading enumeration of firmware risk generated in batch and realtime based on statistical findings.
        </div>
        <div class="gridcontent">
            <strong>Thoughtful Modeling</strong><br/>Preparation of data after exploration for more accurate statistics and metrics at the other side of the pipe.
        </div>
        <div class="gridcontent">
            <strong>Diving Deep</strong><br/>Long hours spent understanding the engine underlying Spark & Spark's configuration itself.
        </div>
    </div>
    <div class="column">
        <div class="gridcontent">
            <strong>Scalability</strong><br/>Performance in batch using AWS Glue, and in real-time using either EMR or dynamically scaling clusters in ECS.
        </div>
        <div class="gridcontent">
            <strong>Extensibility</strong><br/>Full-fledged Spark-only data ETL libraries custom-crafted for statistical analysis on a massive dataset.
        </div>
        <div class="gridcontent">
            <strong>Test-ability</strong><br/>Custom PySpark unit testing framework coupled with scripts for auto-generation of ready-to-use test DataFrames and RDDs, as desired.
        </div>
        <div class="gridcontent">
            <strong>Flexibility</strong><br/>Connecting to your data as JDBC or on HDFS or as Parquet or as ORC -- transferring it to any of them -- and back again -- no problems! ( Just be careful with your truncate/load ops! )
        </div>
    </div>
</div>
`
}

let finiteStateHoverable = document.getElementById('fs-hoverable');
finiteStateHoverable.addEventListener('click', SetDescription.bind(this, workExperienceDescriptionDiv, 'workExperienceDescriptionState', fsDescription));

let awsHoverable = document.getElementById('aws-hoverable');
awsHoverable.addEventListener('click', SetDescription.bind(this, programmingExperienceDescriptionDiv, 'programmingExperienceDescriptionState', awsDescription));

let pythonHoverable = document.getElementById('python-hoverable');
pythonHoverable.addEventListener('click', SetDescription.bind(this, programmingExperienceDescriptionDiv, 'programmingExperienceDescriptionState', pythonDescription));

let sparkHoverable = document.getElementById('spark-hoverable');
sparkHoverable.addEventListener('click', SetDescription.bind(this, programmingExperienceDescriptionDiv, 'programmingExperienceDescriptionState', sparkDescription));