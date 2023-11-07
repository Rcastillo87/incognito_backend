const { check } = require('express-validator');

const register_validator = [
    check('name').not().isEmpty(),
    check('perRoleId').not().isEmpty(),
    check('perCompanyId').not().isEmpty(),
    check('email').isEmail().not().isEmpty(),
    // check('profilePhoto').isURL().not().isEmpty(),
    check('password').isLength({ min: 8 }).not().isEmpty(),
];

module.exports = {register_validator}