import {RdbGraphClient} from "../../src/RdbGraphClient";

export const testClient = new RdbGraphClient({
    host: 'localhost',
    port: 55432,
    user: 'root',
    password: 'root',
    database: 'graph',
});
