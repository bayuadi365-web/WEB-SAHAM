import { IDX_STOCKS, IHSG_DATA } from './src/data/idxStocks.js';
import fs from 'fs';

const data = {
    idxStocks: IDX_STOCKS,
    ihsgData: IHSG_DATA
};

fs.writeFileSync('database/seeders/stocks_data.json', JSON.stringify(data, null, 2));
console.log('Successfully exported stock data to JSON');
