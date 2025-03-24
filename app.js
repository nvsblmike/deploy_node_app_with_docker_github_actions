const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const client = require('prom-client');

const app = express();

// Create a Registry to register metrics
const register = new client.Registry();

// Enable the collection of default metrics (CPU, memory, etc.)
client.collectDefaultMetrics({ register });

console.log('Prometheus metrics enabled');

// Define a custom metric (Example: HTTP request counter)
const httpRequestCounter = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code'],
  });
  
register.registerMetric(httpRequestCounter);



// Expose the `/metrics` endpoint
app.use('/metrics', async (req, res, next) => {
    try {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Content-Type', register.contentType);
      res.status(200).send(await register.metrics());
    } catch (err) {
      next(err); // Pass errors to Express error handler
    }
});

//  This helps in parsing text kind of data in json format
app.use(bodyParser.urlencoded({ extended: false }));

//  This helps to make public folder as accesable directory
//  Now we can use /css/man.css directl as it will be serched 
//  in public folder only
app.use(express.static(path.join(__dirname,'public')));

app.use('/admin', adminData.rouutes);
app.use(shopRoutes);

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname,'views','404.html'));
});

app.listen(3000, '0.0.0.0');
