'use strict';

var _ = require('lodash');
var kue = require('kue');

console.log('Starting Kue');
var q = require('./config/kue').kue;

//register kue.
var jobs = require('include-all')({
    dirname     :  __dirname +'/jobs',
    filter      :  /(.+)\.js$/,
    excludeDirs :  /^\.(git|svn)$/,
    optional    :  true
});

_.forEach(jobs, function(job, name){
    console.log('registering handler: '+name);
    q.process(name, job);
})

q.on('job complete', function(id) {
    console.log('removing completed job: '+id);
    kue.Job.get(id, function(err, job) {
        job.remove();
    });
});

process.once('SIGTERM', function (sig) {
    q.shutdown(function (err) {
        console.log('Kue is shut down.', err || '');
        process.exit(0);
    }, 5000);
});
