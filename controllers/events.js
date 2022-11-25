const {response} = require('express');
const Event = require('../models/Event');

const getEvents = async(req, res = response) => {
    
    const events = await Event.find()
                              .populate('user','name');
    
    res.json({
        ok: true,
        msg: events
    });
};

const createEvent = async(req, res = response) => {

    const event = new Event(req.body);

    event.user = req.uid;

    try {
        const saveEvent = await event.save();

        res.status(201).json({
            ok: true,
            msg: 'Event created',
            event: saveEvent
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Talk to the administrator',
        });
    };
    
};

const updateEvent = async(req, res = response) => {

    const eventId = req.params.id;
    const uid = req.uid;

    try {
        const event = await Event.findById(eventId);
        if(!event){
            return res.status(404).json({
                ok: false,
                msg: 'The event does not exist'
            });
        };

        if(event.user.toString() !== uid){
            return res.status(401).json({
                ok: false,
                msg: 'You are not authorized'
            });
        };

        const newEvent = {
            ...req.body,
            user: uid
        };

        const eventoActualizado = await Event.findByIdAndUpdate(eventId, newEvent, {new: true});

        res.json({
            ok: true,
            event: eventoActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Talk to the administrator'
        });
    };
};

const deleteEvent = async(req, res = response) => {

    const eventId = req.params.id;

    try {
        const event = await Event.findById(eventId);

        if(!event){
            return res.status(400).json({
                ok: false,
                msg: 'The event does not exist'
            });
        };

        if(event.user.toString() !== req.uid) {
            return res.status(401).json({
                ok: false,
                msg: 'You are not authorized'
            });
        };

        await Event.findByIdAndDelete(eventId, {new: true});
        
        res.status(200).json({
            ok: true,
            msg: 'Deleted event'
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Talk to the administrator'
        })
    };
    
};

module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
}