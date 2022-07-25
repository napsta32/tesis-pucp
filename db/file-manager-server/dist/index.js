"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const data_source_1 = require("./data-source");
dotenv_1.default.config();
const server = (0, express_1.default)();
const host = process.env.HOST || 'http://localhost';
const port = process.env.PORT || '8500';
server.use('/', app_1.default);
data_source_1.AppDataSource.initialize().then(async () => {
    // Initialize db
}).catch(error => console.log(error));
server.listen(port, () => {
    console.log(`⚡️[server]: Server is running at ${host}:${port}`);
});
//# sourceMappingURL=index.js.map