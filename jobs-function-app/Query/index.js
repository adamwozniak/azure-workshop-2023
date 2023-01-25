const CosmosClient = require('@azure/cosmos').CosmosClient;

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const endpoint = process.env.dbendpoint;
    const key = process.env.dbkey;
    const databaseId = 'jobs';
    const containerId = 'jobs';

    const client = new CosmosClient({ endpoint, key });
    const database = client.database(databaseId);
    const container = database.container(containerId);

    const queryId = req.body.id;
    const queryName = req.body.name;
    const queryTag = req.body.tag;

    let results = [];
    let querySpec;

    if (queryId) {
        querySpec = {
            query: "SELECT * FROM jobs j WHERE j.id = @id ",
            parameters: [
                { name: "@id", value: queryId }
            ]
        };
    } else if (queryName) {
        querySpec = {
            query: "SELECT * FROM jobs j WHERE j.name = @name ",
            parameters: [
                { name: "@name", value: queryName }
            ]
        };
    } else if (queryTag) {
        querySpec = {
            query: "SELECT * FROM jobs j WHERE (ARRAY_CONTAINS(j.tags,@tag))",
            parameters: [
                { name: "@tag", value: queryTag }
            ]
        };
    } else {
        querySpec = {
            query: "SELECT * FROM jobs j",
        }
    }

    try {
        results = await container.items.query(querySpec).fetchAll();
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: {
                message: 'Success',
                total: results?.resources?.length,
                jobs: results
            },
            headers: {
                'Content-Type': 'application/json'
            }
        };
    } catch (err) {
        context.res = {
            status: 500, /* Defaults to 200 */
            body: {
                message: 'Fails',
                details: err
            },
            headers: {
                'Content-Type': 'application/json'
            }
        };
    } 
}