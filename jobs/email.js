module.exports = function (job, done) {

  //   // sendEmail(job.data, done);
    console.log('We launch the task');
    console.log('data:');
    console.log(job.data);

    done();
}
