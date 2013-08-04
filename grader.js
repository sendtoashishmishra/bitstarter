#!/usr/bin/env node

var cheerio = require('cheerio');
var program = require('commander');
var rest = require('restler');
var fs = require('fs');
var my_default_html_file = "index.html";
var my_default_checks_file = "checks.json";
var DEFAULT_URL = "";

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};


var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = htmlfile;
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};



var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};


if(require.main == module) {
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), my_default_checks_file)
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), my_default_html_file)
        .option('-u, --url <url_file>', 'Url of index.html', DEFAULT_URL)
        .parse(process.argv);
    if (program.url.length > 0) {
        var loadUrlContent = function(result) {
            if(result instanceof Error) {
                console.log("Error while loading url: %s. Exiting.", result.message);
                process.exit(2);
            } else {
                var checkJson = checkHtmlFile(cheerio.load(result), program.checks);
                var outJson = JSON.stringify(checkJson, null, 4);
                console.log(outJson);
            }
        };
        rest.get(program.url).on('complete', loadUrlContent);
    } else {
        var checkJson = checkHtmlFile(cheerioHtmlFile(program.file), program.checks);
        var outJson = JSON.stringify(checkJson, null, 4);
        console.log(outJson);
    }
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
