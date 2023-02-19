import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    //create graph vertex table with id, label, properties as jsonb
    await knex.schema.createTable('vertex', (table) => {
        table.increments('id').primary();;
        table.string('label');
        table.jsonb('properties');
    });

    //create graph edge table with id, label, from, to, properties as jsonb
    await knex.schema.createTable('edge', (table) => {
        table.increments('id').primary();
        table.string('label');
        table.integer('from').references('id').inTable('vertex');
        table.integer('to').references('id').inTable('vertex');
        table.jsonb('properties');
    });

}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('vertex');
    await knex.schema.dropTable('edge');
}