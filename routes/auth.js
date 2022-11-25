/*
    Rutas de Usuario / Auth
    host + /api/auth
*/

const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();
const {createUser, loginUser, revalidateToken} = require('../controllers/auth');
const { fieldValidator } = require('../middlewares/fieldsValidator');
const {validarJWT} = require('../middlewares/validar-jwt');

router.post(
    '/new',
    [//middlewares
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser de 6 caracteres').isLength({min: 6}),
        fieldValidator
    ],
    createUser
);

router.post(
    '/',
    [
        check('email', 'El email es obligario').isEmail(),
        check('password', 'El password debe de ser de 6 caracteres o más').isLength({min: 6},),
        fieldValidator
    ],
    loginUser
);

router.get('/renew', [
    validarJWT
],revalidateToken);

module.exports = router;