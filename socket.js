const fs = require( 'fs' )
const path = require( 'path' )

const Koa = require( 'koa' )
const kue = require( 'kue' )
const queue = require('./config/kue').kue;
const IO = require( 'koa-socket' )
const co = require( 'co' )

const app = new Koa()
const io = new IO()

io.attach( app )

/**
 * Socket middlewares
 */
io.use( co.wrap( function *( ctx, next ) {
  console.log( 'Socket middleware' )
  const start = new Date
  yield next()
  const ms = new Date - start
  console.log( `WS ${ ms }ms` )
}))

/**
 * Socket handlers
 */
io.on( 'connection', ctx => {
  console.log( 'Join event', ctx.socket.id+' with :'+io.connections.size+' connections' )
  io.broadcast( 'connections', {
    numConnections: io.connections.size
  })

})

io.on( 'disconnect', ctx => {
  console.log( 'leave event', ctx.socket.id )
  io.broadcast( 'connections', {
    numConnections: io.connections.size
  })
})



queue.process('alerts', function(job, done) {

  console.log('data:');
  console.log(job.data);
  var user = "testuser";
  var msg = "testmsg";
  var type = "warning";
  alertClients(user, msg, type)

  done();
});

// Alerts all clients (broadcast) via socket io.
function alertClients(user, msg, type) {
  console.log("SocketIO alerting clients: ", msg);
  io.broadcast('alert', {user: user, message: msg, time: new Date(), type});
}

queue.on('job complete', function(id) {
    console.log('removing send alert job: '+id);
    kue.Job.get(id, function(err, job) {
        job.remove();
    });
});


// Alerts all clents via socket io.





const PORT = 8001
app.listen( 8001, () => {
  console.log( `Listening on ${ PORT }` )
} )
