"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
let todos = [];
router.get("/todos", (req, res, next) => {
    res.status(200).json({ todos });
});
//
router.post("/todos", (req, res, next) => {
    const body = req.body;
    const newTodo = {
        id: Math.random().toString(),
        text: body.text,
    };
    todos.push(newTodo);
    return res.status(201).json({ message: "Created successfully", todos });
});
//
router.put("/todos/:todoId", (req, res, next) => {
    const body = req.body;
    const params = req.params;
    const todoIndex = todos.findIndex((item) => item.id === params.todoId);
    if (todoIndex >= 0) {
        todos[todoIndex] = {
            id: req.params.todoId,
            text: body.text,
        };
        return res.status(201).json({ message: "Updated successfully", todos });
    }
    return res.status(404).json({ message: "Todo not found" });
});
//
router.delete("/todos/:todoId", (req, res, next) => {
    const params = req.params;
    const todoIndex = todos.findIndex((item) => item.id === params.todoId);
    if (todoIndex >= 0) {
        todos = todos.filter((item) => item.id !== req.params.todoId);
        return res.status(201).json({ message: "Deleted successfully", todos });
    }
    return res.status(404).json({ message: "Todo not found" });
});
exports.default = router;
