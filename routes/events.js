/*

Event Routes
/api/events

*/

const express = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');


const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/events');
const { check } = require('express-validator');
const { fieldValidator } = require('../middlewares/fieldsValidator');
const { isDate } = require('../helpers/isDate');

const router = express.Router();

router.use(validarJWT);

// tienene que pasar por el JWT
router.get('/',getEvents);

//post
router.post(
    '/',
    [
        check('title', 'Title is required').not().isEmpty(),
        check('start', 'Start date is required').custom(isDate),
        check('end', 'Start date is required').custom(isDate),
        fieldValidator
    ],
    createEvent
);

//actualizar
router.put(
    '/:id',
    [
        check('title', 'Title is required').not().isEmpty(),
        check('start', 'Start date is required').custom(isDate),
        check('end', 'Start date is required').custom(isDate),
        fieldValidator
    ],
    updateEvent
);

//borrar evento
router.delete('/:id',deleteEvent);

module.exports = router;