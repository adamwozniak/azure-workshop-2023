const CosmosClient = require('@azure/cosmos').CosmosClient;
const BulkOperationType = require('@azure/cosmos').BulkOperationType;

module.exports = async function (context, myQueueItem) {
    const endpoint = process.env.dbendpoint;
    const key = process.env.dbkey;
    const databaseId = 'jobs';
    const containerId = 'jobs';

    const client = new CosmosClient({ endpoint, key });
    const database = client.database(databaseId);
    const container = database.container(containerId);

    await container.items.bulk(myQueueItem);

    context.log('JavaScript queue trigger function processed work item with size', myQueueItem);
};