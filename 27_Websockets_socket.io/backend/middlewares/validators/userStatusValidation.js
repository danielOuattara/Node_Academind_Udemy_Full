const { body } = require("express-validator");

const userStatusValidation = [body("status").trim().not().isEmpty()];

module.exports = userStatusValidation;
