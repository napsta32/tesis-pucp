import server from '.';

export default function () {
    afterAll(async () => {
        await new Promise((resolve, reject) => {
            server.close((err) => {
                if (err) reject(err);
                else resolve(undefined);
            });
        });
        process.exit(0);
    });
}
