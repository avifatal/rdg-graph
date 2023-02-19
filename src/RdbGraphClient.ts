
import knex, {Knex} from 'knex';
export interface Vertex {
    id?: number;
    label: string;
    properties?: { [key: string]: any };
}

export interface Edge {
    id: string;
    label: string;
    from: string;
    to: string;
    properties: { [key: string]: any };
}

export interface IndependentEdge {
    label: string;
    properties: { [key: string]: any };
}
export interface RdbGraphConfig {
    host: string;
    port: number;
    user: string;
    database: string;
    password: string;
}

export class RdbGraphService {
    constructor(private readonly client: RdbGraphClient) {

    }

    async createVertex(vertex: Vertex): Promise<number> {
        let res;
        await this.client.knex.transaction(async (trx) => {
            res = await this.client.knex('vertex').insert(vertex).returning('id');
        });
        return res[0].id;
    }

    async getVertex(id: number): Promise<Vertex> {
        return await this.client.knex('vertex').where('id', id).first();
    }

    async findVertex(params: {label?: string, properties?: { [key: string]: any }}): Promise<Vertex> {
        return await this.client.knex('vertex').where(params).first();
    }

    async createVertexAndEdge(vertexA: Vertex, vertexB: Vertex, edge: IndependentEdge): Promise<{vertexA: Vertex, vertexB: Vertex, edge: Edge}> {
        let res;
        let edgeOnDb = edge as Edge;
        await this.client.knex.transaction(async (trx) => {
            res = await this.client.knex('vertex').insert(vertexA).returning('id');
            const vertexAId = res[0].id;
            res = await this.client.knex('vertex').insert(vertexB).returning('id');
            const vertexBId = res[0].id;
            edgeOnDb.from = vertexAId.toString();
            edgeOnDb.to = vertexBId.toString();
            const edgeId = await this.client.knex('edge').insert(edgeOnDb).returning('id');

            vertexA.id = vertexAId;
            vertexB.id = vertexBId
            edgeOnDb.id = edgeId[0].id;
        });

        return {vertexA: vertexA, vertexB: vertexB, edge: edgeOnDb};
    }
}


export class RdbGraphClient{
    public readonly knex: Knex;

    constructor(config: RdbGraphConfig) {
        this.knex = knex({
            client: 'pg',
            connection: {
                host: config.host,
                port: config.port,
                user: config.user,
                database: config.database,
                password: config.password,

            },
            migrations: {
                tableName: 'migrations',
                directory: '../dist/migrations',
                loadExtensions: ['.js'],
            }
        });
    }
}

export class RdbGraphClientMigrator{
    constructor(private readonly client: RdbGraphClient) {

    }
    async migrate(): Promise<void> {
        await this.client.knex.migrate.latest();
    }
}