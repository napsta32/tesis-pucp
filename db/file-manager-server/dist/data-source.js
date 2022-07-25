"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Project_1 = require("./entity/Project");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'mariadb',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'pass',
    database: 'file_manager_db',
    synchronize: true,
    logging: false,
    entities: [Project_1.Project],
    migrations: [],
    subscribers: []
});
//# sourceMappingURL=data-source.js.map