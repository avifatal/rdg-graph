import * as child from 'child_process';
import {promisify} from 'util';
import {RdbGraphClientMigrator} from "../src/RdbGraphClient";
import {testClient} from "./tests/testClient";

const exec = promisify(child.exec);

export default async () =>{
    await exec('docker compose up -d');
    const migrator = new RdbGraphClientMigrator(testClient);
    await migrator.migrate();
};