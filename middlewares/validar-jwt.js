const {response} = require('express');
const jwt = require('jsonwebtoken');

const validarJWT = (req, res = response, netx) => {
    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            ok: false,
            msg: 'There is no token in the request'
        })
    }

    try {
        const {uid, name} = jwt.verify(
            token,
            process.env.SECRET_JWT_SEED
        );

        req.uid = uid;
        req.name = name;
        
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Wrong token'
        })
    }

    netx();
}

module.exports = {
    validarJWT
}