import express, { Request, Response} from 'express';
import { bluedart } from './api/bluedart';

const serverless = require('serverless-http');

const app = express();
const port = 3000;

app.get('/', async (req, res) => {
    res.send('Hello World!')
});

app.get('/bluedart', async (req: Request, res: Response) => {
    await bluedart(req, res);
})

// app.listen(port, () => {
//     console.log(`Example app listening on port ${port}`)
// })

module.exports.handler = serverless(app);
