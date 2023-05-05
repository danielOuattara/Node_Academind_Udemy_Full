"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const todoRoutes_1 = __importDefault(require("./routes/todoRoutes"));
const notFound_1 = __importDefault(require("./Errors/notFound"));
app.use(express_1.default.json());
app.use("/api/v1", todoRoutes_1.default);
app.use("*", notFound_1.default);
app.listen(3000, () => console.log("app is running on http://localhost:3000"));
