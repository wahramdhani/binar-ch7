const Room = require('../models').Room


const checkRole = (user) => {
    const {role} = user

    if(role !== 'PlayerUser') {
        return true
    }
    return false
}

const createRoom = async (req, res) => {
    const {room_name} = req.body;

    const isAdmin = checkRole(req.user)

    if(!isAdmin)
    return res.status(400).json({
        status: 'failed',
        msg: 'role is not allow to create room'
    })
    try {
        const checkRoom = await Room.findOne({
            where: {
                room_name
            }
        })
        if(checkRoom) {
            return res.status(400).json({
                status: 'failed',
                msg: `room ${room_name} already created`
            })
        }
        const input = {room_name, player1: req.user.id}
        const room = await Room.create(input, {
            room_name
        })
        return res.status(200).json({
            status: 'success',
            msg : `room  ${room_name} created`
        })
    } catch (error) {
        return res.status(500).json({
            status : 'failed',
            error: [error.message]
        })
    }
}

const listRoom = async (req, res) => {
    return Room.findAll()
    .then(data => {
        res.status(200).json({
            status: 'success',
            data: {
                rooms: data
            }
        })
        })
}

const deleteRoom = async (req, res) => {
    const room = await Room.findOne({
        where: {
            id: req.params.id
        }
    })
    const isAdmin = checkRole(req.user)

    if(!isAdmin)
    return res.status(400).json({
        status: 'failed',
        msg: 'role is not allow to delete room'
    })
    
    if(!room) {
        return res.status(400).json({
            status: 'failed',
            msg: `room id ${req.params.id} not found`
        })
    } else {
        await Room.destroy({
            where: {
                id: room.id
            }
        })
        return res.status(200).json({
            status: 'success',
            msg: 'room deleted'
        })
    }
}

const joinRoom = async (req, res) => {
    const {room_name} = req.body
    try {
        const findRoom = await Room.findOne({
            where: {
                room_name
            }
        })
        if(!findRoom) {
            return res.status(400).json({
                status: 'failed',
                msg: 'room not found'
            })
        }
        if(findRoom.player1 == req.user.id || findRoom.player2 == req.user.id) {
            return res.status(400).json ({
                status: 'failed',
                id: req.user.id,
                username: req.user.username,
                msg: 'already in the room'
            })
        }
        if(findRoom.player2) {
            return res.status(400).json({
                room_name: findRoom.room_name,
                msg: 'room is full'
            })
        }
        const input = {player2: req.user.id}
        await Room.update(input, {
            where: {room_name: findRoom.room_name}
        })
        .then(result => {
            res.status(200).json({
                status: 'success',
                msg: `you join room ${room_name}`
            })
        })

    } catch (error) {
        res.status(500).json({
            status: 'failed',
            msg: 'internal server error'
        })
    }
}

module.exports = {
    createRoom, listRoom, deleteRoom, joinRoom
}