// http_server.js
const http = require('http');

const conversionFactors = {
    km: { miles: 0.621371, meters: 1000, yards: 1093.61, feet: 3280.84 },
    miles: { km: 1.60934, meters: 1609.34, yards: 1760, feet: 5280 },
    meters: { km: 0.001, miles: 0.000621371, yards: 1.09361, feet: 3.28084 },
    yards: { km: 0.0009144, miles: 0.000568182, meters: 0.9144, feet: 3 },
    feet: { km: 0.0003048, miles: 0.000189394, meters: 0.3048, yards: 0.333333 }
};

const server = http.createServer((req, res) => {
    if (req.method === 'OPTIONS') {
        // Preflight request handling
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        res.end();
    } else if (req.method === 'POST') {
        let body = '';

        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {
            try {
                const request = JSON.parse(body);
                const { distance, unit } = request;
                let results = {};

                for (let [key, factor] of Object.entries(conversionFactors[unit])) {
                    results[key] = distance * factor;
                }

                res.writeHead(200, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify(results));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Invalid JSON');
            }
        });
    } else {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('Method Not Allowed');
    }
});

server.listen(4000, () => {
    console.log('HTTP server running on port 4000');
});
