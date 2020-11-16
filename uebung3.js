const postgres = require('postgres')
const sql = postgres('postgres://postgres:najaeinpasswort@postgres:5432');

(async() => {
    console.log(await sql`
        SELECT 
            to_char(ts, 'DD.MM.YYYY HH24:MI:SS.MS') as ts_in,
            data -> 'time' as ts_meas,
            data -> 'id' as id,
            data -> 'temp' as temp,
            data -> 'battery' as battery,
            data -> 'memTotal' as memtotal,
            data -> 'memAvailable' as memavailable,
            data -> 'load' as load,
            to_timestamp(data ->> 'time', 'DD.MM.YYYY HH24:MI:SS.MS') - ts as ts_diff,
            avg(cast(data ->> 'temp' as decimal)) over (rows between 3 preceding and 3 following) as avg_temp
        FROM iot
    `)
})();