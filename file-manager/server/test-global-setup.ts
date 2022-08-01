// import server from './src';
import {AppDataSource} from './src/data-source';

export default function () {
    afterAll(async () => {
        await AppDataSource.destroy();
        // process.exit(0);
    });
}
