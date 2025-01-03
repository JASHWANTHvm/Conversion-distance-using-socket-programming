// tcp_server.js
const net = require('net');

const conversionFactors = {
    km: { miles: 0.621371, meters: 1000, yards: 1093.61, feet: 3280.84 },
    miles: { km: 1.60934, meters: 1609.34, yards: 1760, feet: 5280 },
    meters: { km: 0.001, miles: 0.000621371, yards: 1.09361, feet: 3.28084 },
    yards: { km: 0.0009144, miles: 0.000568182, meters: 0.9144, feet: 3 },
    feet: { km: 0.0003048, miles: 0.000189394, meters: 0.3048, yards: 0.333333 }
};

const server = net.createServer((socket) => {
    socket.on('data', (data) => {
        const request = JSON.parse(data.toString());
        const { distance, unit } = request;
        let results = {};

        for (let [key, factor] of Object.entries(conversionFactors[unit])) {
            results[key] = distance * factor;
        }

        socket.write(JSON.stringify(results));
    });
});

server.listen(4002, () => {
    console.log('TCP server running on port 4002');
});
