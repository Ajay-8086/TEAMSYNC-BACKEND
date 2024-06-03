"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const config_1 = __importDefault(require("./config/config"));
const cors_1 = __importDefault(require("cors"));
// express app setup 
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
// middlewares 
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
//routes
// port listening and db connecting 4
(0, config_1.default)().then(() => {
    app.listen(port, () => {
        console.log(`server listening at ${port}`);
    });
});
