"use strict";

const http = require("http"),
    fs = require("fs"),
    // sys = require('sys'),
    querystring = require('querystring'),
    exec = require('child_process').exec;
// 
var oldConfigData = require('./config.json');

// An executioner 
function execute(datum) {
    if (!datum || !datum.cmd || !datum.fireTime)
        return;
    // 
    console.log("\n\n=> Executing", datum.name);
    exec(datum.cmd, function(error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });
}


// read old config resume all
for (let i = 0; i < oldConfigData.length; i++) {
    let datum = oldConfigData[i];
    // if not enough info remove from config
    if (!datum || !datum.cmd || !datum.fireTime) {
        oldConfigData.splice(i, 1);
        i--;
        continue;
    }

    // fireAt and fireTime should be in milliseconds
    let fireAt = new Date(datum.fireTime) - new Date().getTime();
    // if already executed, remove from oldConfigData
    if (fireAt < 0) {
        oldConfigData.splice(i, 1);
        i--;
        continue;
    }
    // else
    // schedule for execution
    console.log("\n\n=> ", datum.name, " will be executed in ", fireAt);
    setTimeout(function() {
        execute(this);
    }.bind(datum), fireAt);
}
// reset configData: as we removed executed jobs from it
pushToConfig(null, oldConfigData);

// 
function pushToConfig(job, config) {
    // Also store it for further user
    try {
        if (!config)
            config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
        if (!!job && !!job.cmd && !!job.fireTime)
            config.push(job);
        // 
        fs.writeFile('./config.json', JSON.stringify(config || []));
    } catch (e) {
        console.log("Error: ", e.stack || e);
    }
}

// create server 
var server = http.createServer(function(request, response) {
    let query = (request.url || '').replace('/?', '');
    let job = querystring.parse(query);
    // 
    if (!!job && !!job.cmd && !!job.fireTime) {
        let fireAt = new Date(job.fireTime) - new Date().getTime();
        console.log("\n\n==> ", job.name, " will be executed in ", fireAt);
        setTimeout(function() {
            execute(this);
        }.bind(job), fireAt);
        // 
        pushToConfig(job);
    }
    response.writeHead(200, { "Content-Type": "application/json" });
    response.write(JSON.stringify(job));
    response.end();
});

server.listen(3005);
console.log("Server is listening on 3005");
