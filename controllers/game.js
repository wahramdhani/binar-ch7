
const {Room, gameHistories} = require('../models')

const PAPER = "P"
const SCISSORS = "S"
const ROCK = "R"

const WIN = "WIN"
const LOSE = "LOSE"
const DRAW = "DRAW"
const GameCompleted = 3


const checkGameComplete = (room) => {
    if(room.p1Pick && room.p2Pick) {
        if(room.p1Pick.length == GameCompleted && room.p2Pick.length == GameCompleted) {
            return true
        }
    }
    return false
}

// const player = async (room) => {
//     if(room.player1 == p1 && room.player2 == p2) {
//         return true
//     }
//     return false



const checkPlayerTurn = async (room, p1, p2) => {
    const {p1Pick, p2Pick} = room

    if(p1Pick && p2Pick) {
        if(p1 && p1Pick.length > p2Pick.length) {
            return false
        } else if(p2 && p2Pick > p1Pick.length) {
            return false
        }
    } else if(p1 && p1Pick && !p2Pick) {
        return false
    } else if(p2 && p2Pick && !p1Pick) {
        return false
    }
    return true
}

const savePick = async (room, pick, p1, p2) => {
    const {id: roomId} = room

    if(p1) {
        try {
            let updatePick = []
            if(room.p1Pick) {
                room.p1Pick.push(pick)
                updatePick = [...room.p1Pick]
            } else if(!room.p1Pick) {
                updatePick.push(pick)
            }
            await Room.update({p1Pick: updatePick}, {where: {id: roomId}})
        } catch (error) {
            return {error: err}
        }
    }
    if(p2) {
        try {
            let updatePick = []
            if(room.p2Pick) {
                room.p2Pick.push(pick)
                updatePick = [...room.p2Pick]
            } else if(!room.p2Pick) {
                updatePick.push(pick)
            }
            await Room.update({p2Pick: updatePick}, {where: {id: roomId}})
        } catch (error) {
            return {error: err}
        }
    }
    return {
        error: null
    }
}

const gameLogic = async (room, gameHistories,p1Pick, p2Pick, p1,p2) => {
    const {id: roomId} = room

    if(p1 && p1Pick == p2 && p2Pick) {
        gameHistories.create({
            user_id: {p1, p2},
            room_id: roomId,
            result: DRAW
        })
    }

}

const game = async (req, res) => {
    const {pick} = req.body

    if(pick !== SCISSORS && pick !== PAPER && pick !== ROCK) {
        return res.status(400).json({
            status: 'failed',
            msg: "wrong pick category"
        })
    }
    const {id: roomId} = req.params

    let room = {}
    try {
        room = await Room.findOne({
            where: {
                id: roomId
            }
        })
    } catch (error) {
        return res.json(error)
    }

    if (!room) {
        return res.status(400).json({
            status: 'failed',
            msg: 'room not found'
        })
    }
    const p1 = {room, player1: req.user.id}
    const p2 = {room, player2: req.user.id}

    // const playerOk = player
    // if(playerOk) {
    //     return res.json("player detected")
    // }
    const isGameCompleted = checkGameComplete(room);
    
    if(isGameCompleted) { 
        return res.json("game is completed")
    }

    const playerTurn = await checkPlayerTurn(
        room,
        p1,
        p2
    )
    if(!playerTurn) {
        return res.json(" wait for your opponent to pick")
    }
    const {error: processError} = await savePick(
        room,
        pick,
        p1,
        p2
    )
    if(processError) {
        return res.json(processError)
    }

    let output = {}
    let roomupdate = {}
    try {
        roomupdate = await Room.findOne({
            where: {id: roomId}
        })
        output = { ...roomupdate.dataValues}
    } catch (error) {
        return res.json(error)
    }
    
    const lastGame = await checkGameComplete(roomupdate)
    console.log('check this', lastGame);

    if(lastGame) {
        output = {
            roomId,
            msg: 'game is over'
        }
        const isGameLogic = await gameLogic(gameHistories)

        if(isGameLogic) {
            return res.json(`${result}`)
        }
    }
    return res.json(output)
}

module.exports = {
    game
}
