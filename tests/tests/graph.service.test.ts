import {
    IndependentEdge,
    RdbGraphService,
    Vertex
} from "../../src/RdbGraphClient";


import {beforeAll, describe, expect, test} from 'vitest';
import {testClient} from "./testClient";
import {randAlphaNumeric, randNumber, randWord} from "@ngneat/falso";
const randText = () => randAlphaNumeric({length: 18}).join('');
describe('RdbGraphService', () => {
    beforeAll(async () => {

    });
    test('When creating a node, then make sure it was created', async () => {
        // Arrange
        const service = new RdbGraphService(testClient);
        const vertex: Vertex = {
            label: 'test',
            properties: {
                name: 'test'
            }
        }
        // Act
        const id = await service.createVertex(vertex);
        const createdVertex = await service.getVertex(id);
        // Assert
        expect(createdVertex).toMatchObject(vertex);
    });

    test('When creating a node, then make sure it can be found', async () => {
        // Arrange
        const service = new RdbGraphService(testClient);
        const vertex: Vertex = {
            label: randText(),
            properties: {
                name: 'test'
            }
        }
        await service.createVertex(vertex);
        // Act
        const createdVertex = await service.findVertex({label: vertex.label});
        // Assert
        expect(createdVertex).toMatchObject(vertex);
    });

    test('When creating a node, then make sure it can be found via properties', async () => {
        // Arrange
        const service = new RdbGraphService(testClient);
        const vertex: Vertex = {
            label: randText(),
            properties: {
                name: randText(),
            }
        }
        await service.createVertex(vertex);
        // Act
        const createdVertex = await service.findVertex({properties: vertex.properties});
        // Assert
        expect(createdVertex).toMatchObject(vertex);
    });


    test('When creating a node, then make sure it can be found via properties And label', async () => {
        // Arrange
        const service = new RdbGraphService(testClient);
        const vertex: Vertex = {
            label: randText(),
            properties: {
                name: randText(),
            }
        }
        await service.createVertex(vertex);
        // Act
        const createdVertex = await service.findVertex({label: vertex.label, properties: vertex.properties});
        // Assert
        expect(createdVertex).toMatchObject(vertex);
    });


    test('When creating createVertexAndEdge, then make sure it was created', async () => {
        // Arrange
        const service = new RdbGraphService(testClient);
        const vertexA: Vertex = {
            label: randText(),
            properties: {
                name: 'test'
            }
        }
        const vertexB: Vertex = {
            label: randText(),
            properties: {
                name: 'test'
            }
        }
        const edge: IndependentEdge = {
            label: randText(),
            properties: {
                name: 'test'
            }
        }
        // Act
        const created = await service.createVertexAndEdge(vertexA, vertexB, edge);

        // Assert
        expect(created.vertexA.id).toBeGreaterThan(0);
        expect(created.vertexB.id).toBeGreaterThan(0);
        expect(created.edge.id).toBeGreaterThan(0);
        expect(created.vertexA).toMatchObject(vertexA);
        expect(created.vertexB).toMatchObject(vertexB);
        expect(created.edge).toMatchObject(edge);

    });

    //create a complex graph test with multiple nodes and edges
    test('When creating a complex graph, then make sure it was created', async () => {

    });
});