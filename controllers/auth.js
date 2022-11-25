const {response} = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const {generarJWT} = require('../helpers/jwt');

const createUser = async (req, res = response) => {
    const {name, email, password} = req.body;

    try {
        let user = await User.findOne({email});

        
        if(user){
            return res.status(400).json({
                ok: false,
                msg: 'Email already use'
            });
        }
        
        user = new User(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);
        
        await user.save();

        // Generar JWT
        const token = await generarJWT(user.id, user.name);


        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contact with admin'
        });
    };
};

const loginUser = async(req, res = response) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({
                ok: false,
                msg: 'user no exist'
            });
        };
        
        // Confirmar password
        const validPassword = bcrypt.compareSync(password, user.password);

        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'Wrong email or password'
            });
        };
        
        // Generar JWT
        const token = await generarJWT(user.id, user.name);

        res.json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contact with admin'
        });
    };

};

const revalidateToken = async(req, res = response) => {

    const {uid, name} = req;
    
    // generar un nuevo JWT y retonarlo en la peticion
    const token = await generarJWT(uid, name);
    
    res.json({
        ok: true,
        uid,
        name,
        token
    });
};

module.exports = {
    createUser,
    loginUser,
    revalidateToken
};