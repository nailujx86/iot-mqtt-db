const mqtt = require('mqtt');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const brokerurl = 'mqtt://broker.hivemq.com';
const deviceId = 'supermqtt';
const os = require('os');
const si = require('systeminformation');
const postgres = require('postgres')
const sql = postgres('postgres://postgres:najaeinpasswort@postgres:5432');
const weirdDateString = () => {date = new Date(); return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}.${date.getMilliseconds()}`}


(async() => {
    
await sql`
    CREATE TABLE IF NOT EXISTS iot (
        ts TIMESTAMP,
        data JSON
    );
`


const subscriber = mqtt.connect(brokerurl);
subscriber.on('connect', () => {
    subscriber.subscribe('iotcourse/channel', (err) => {
        if (err) {
            console.error(err);
        }
        console.log("Client subscribed!");
    });
});
subscriber.on('message', async (topic, message, packet) => {
    console.log({topic: topic, message: message.toString(), qos: packet.qos, retain: packet.retain});
    await sql`
        INSERT INTO iot VALUES (${new Date().toISOString()}, ${message.toString()})
    `
});

const publisher = mqtt.connect(brokerurl);
publisher.on('connect', async() => {
    while (true) {
        let message = {time: weirdDateString(), id: deviceId, temp: (Math.random() * 3 + 20), battery: 100, memTotal: os.totalmem(), memAvailable: os.freemem(), load: (await si.currentLoad()).currentload}
        publisher.publish('iotcourse/channel', JSON.stringify(message), {qos: 1})
        await sleep(5000)
    }
});

})();