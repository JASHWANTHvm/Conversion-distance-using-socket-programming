// udp_server.js
const dgram = require('dgram');
const server = dgram.createSocket('udp4');

server.on('message', (msg, rinfo) => {
    const request = JSON.parse(msg.toString());
    const { distance, unit } = request;
    let results = {};

    for (let [key, factor] of Object.entries(conversionFactors[unit])) {
        results[key] = distance * factor;
    }

    const message = Buffer.from(JSON.stringify(results));
    server.send(message, rinfo.port, rinfo.address);
});

server.bind(4001, () => {
    console.log('UDP server running on port 4001');
});
