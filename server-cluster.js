// server-cluster.js
const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
  // Fork workers equal to the number of available CPUs
  const numCPUs = os.cpus().length;

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork(); // Replace the dead worker
  });
} else {
  require('./index.js');
}
