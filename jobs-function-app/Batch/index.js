const CosmosClient = require('@azure/cosmos').CosmosClient;
const BulkOperationType = require('@azure/cosmos').BulkOperationType;

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const jobsToAdd = req.body?.add || [];
    const jobsToDelete = req.body?.delete || [];

    const endpoint = process.env.dbendpoint;
    const key = process.env.dbkey;
    const databaseId = 'jobs';
    const containerId = 'jobs';

    const client = new CosmosClient({ endpoint, key });
    const database = client.database(databaseId);
    const container = database.container(containerId);

    const operations = [];

    jobsToAdd.forEach(job => {
        const dbOperation = {
            operationType: BulkOperationType.Upsert,
            resourceBody: job
        };
        operations.push(dbOperation);
    });

    jobsToDelete.forEach(job => {
        const dbOperation = {
            operationType: BulkOperationType.Delete,
            id: job.id,
            partitionKey: job.name
        };
        operations.push(dbOperation);
    })

    const responseMessage = `Application will add ${jobsToAdd.length} to DB and will remove ${jobsToDelete.length} from it`;

    try {
        const result = await container.items.bulk(operations);
        context.log(responseMessage);
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: {
                status: 'Success',
                details: responseMessage
            },
            headers: {
                'Content-Type': 'application/json'
            }
        };
    } catch (err) {
        context.log(responseMessage);
        context.res = {
            status: 500, /* Defaults to 200 */
            body: {
                status: 'Fail',
                details: err
            },
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }
}