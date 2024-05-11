import express from 'express';
const app = express();
import { runEvery24Hours } from "./fuctions.js";
import { Ytroute } from './routes/index.js';
import 'express-async-errors';
import * as dotenv from 'dotenv';
import { RequestError } from "./middleware/index.js";
import { deleteFilesDaily } from "./lib/delets.js";
dotenv.config();
const port = process.env.PORT || 5000;
app.use(express.json());
app.get('/', (req, res) => res.send('lol'));
app.use('/api/v1/yt', Ytroute);
app.use(RequestError);
const start = async () => {
    try {
        app.listen(port);
        console.log(`Server is started on http://localhost:${port}`);
    }
    catch (error) {
    }
};
function myCallback() {
    deleteFilesDaily();
}
runEvery24Hours(myCallback);
start();
//# sourceMappingURL=index.js.map