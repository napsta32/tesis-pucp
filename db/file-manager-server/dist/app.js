"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const app = (0, express_1.Router)();
app.get('/projects', (req, res) => {
    return res.json({});
});
exports.default = app;
//# sourceMappingURL=app.js.map