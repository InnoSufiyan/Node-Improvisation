import express from 'express';
import cluster from 'cluster';
import os from 'os';

const app = express();

app.get('/route', (req, res) => {
    res.send(`Route handled by process ${process.pid}`);
});

app.get('/timer', (req, res) => {
    setTimeout(() => {
        res.send(`Timer completed by process ${process.pid}`);
    }, 9000);
});

if (cluster.isPrimary) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers
    const numWorkers = os.cpus().length;
    console.log(`Master process started. Forking ${numWorkers} workers.`);

    for (let i = 0; i < numWorkers; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} exited.`);
    });
} else {
    console.log(`Worker ${process.pid} started`);
    app.listen(3000, () => {
        console.log(`Worker ${process.pid} is listening on port 3000`);
    });
}

