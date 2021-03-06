enum SpriteKindLegacy {
    Player,
    Projectile,
    Food,
    Enemy
}
namespace SpriteKind {
    export const Emitter = SpriteKind.create()
    export const Receiver = SpriteKind.create()
    export const Reflector = SpriteKind.create()
    export const ReflectorNWtoSE = SpriteKind.create()
    export const CursorBox = SpriteKind.create()
}
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    cursorSprite.y += -16
})
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    cursorSprite.y += 16
})
sprites.onOverlap(SpriteKind.Reflector, SpriteKind.Projectile, function (sprite, otherSprite) {
    if (otherSprite.vy != 0) {
        otherSprite.vx = 0 - otherSprite.vy
        otherSprite.vy = 0
    } else if (otherSprite.vx != 0) {
        otherSprite.vy = 0 - otherSprite.vx
        otherSprite.vx = 0
    }
    otherSprite.setFlag(SpriteFlag.Ghost, true)
    pause(100)
    otherSprite.setFlag(SpriteFlag.Ghost, false)
})
sprites.onOverlap(SpriteKind.ReflectorNWtoSE, SpriteKind.Projectile, function (sprite, otherSprite) {
    if (otherSprite.vy != 0) {
        otherSprite.vx = otherSprite.vy
        otherSprite.vy = 0
    } else if (otherSprite.vx != 0) {
        otherSprite.vy = otherSprite.vx
        otherSprite.vx = 0
    }
    otherSprite.setFlag(SpriteFlag.Ghost, true)
    pause(100)
    otherSprite.setFlag(SpriteFlag.Ghost, false)
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (!(cursorSprite.tileKindAt(TileDirection.Center, myTiles.tile3))) {
        reflectorSprite = sprites.create(cursorSprite.image, cursorSprite.kind())
        reflectorSprite.setPosition(cursorSprite.x, cursorSprite.y)
    }
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    cursorSprite.x += 16
})
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (cursorSprite.kind() == SpriteKind.Reflector) {
        cursorSprite.setImage(img`
            8 . . . . . . . . . . . . . . . 
            . 8 . . . . . . . . . . . . . . 
            . . 8 . . . . . . . . . . . . . 
            . . . 8 . . . . . . . . . . . . 
            . . . . 8 . . . . . . . . . . . 
            . . . . . 8 . . . . . . . . . . 
            . . . . . . 8 . . . . . . . . . 
            . . . . . . . 8 . . . . . . . . 
            . . . . . . . . 8 . . . . . . . 
            . . . . . . . . . 8 . . . . . . 
            . . . . . . . . . . 8 . . . . . 
            . . . . . . . . . . . 8 . . . . 
            . . . . . . . . . . . . 8 . . . 
            . . . . . . . . . . . . . 8 . . 
            . . . . . . . . . . . . . . 8 . 
            . . . . . . . . . . . . . . . 8 
            `)
        cursorSprite.setKind(SpriteKind.ReflectorNWtoSE)
    } else {
        cursorSprite.setImage(img`
            . . . . . . . . . . . . . . . 8 
            . . . . . . . . . . . . . . 8 . 
            . . . . . . . . . . . . . 8 . . 
            . . . . . . . . . . . . 8 . . . 
            . . . . . . . . . . . 8 . . . . 
            . . . . . . . . . . 8 . . . . . 
            . . . . . . . . . 8 . . . . . . 
            . . . . . . . . 8 . . . . . . . 
            . . . . . . . 8 . . . . . . . . 
            . . . . . . 8 . . . . . . . . . 
            . . . . . 8 . . . . . . . . . . 
            . . . . 8 . . . . . . . . . . . 
            . . . 8 . . . . . . . . . . . . 
            . . 8 . . . . . . . . . . . . . 
            . 8 . . . . . . . . . . . . . . 
            8 . . . . . . . . . . . . . . . 
            `)
        cursorSprite.setKind(SpriteKind.Reflector)
    }
})
sprites.onOverlap(SpriteKind.Receiver, SpriteKind.Projectile, function (sprite, otherSprite) {
    otherSprite.destroy()
    if (sprites.readDataString(sprite, "colour") == sprites.readDataString(otherSprite, "colour")) {
        statusbars.getStatusBarAttachedTo(StatusBarKind.Energy, sprite).value += 1
    }
})
function prepareCursor () {
    cursorSprite = sprites.create(img`
        . . . . . . . . . . . . . . . 8 
        . . . . . . . . . . . . . . 8 . 
        . . . . . . . . . . . . . 8 . . 
        . . . . . . . . . . . . 8 . . . 
        . . . . . . . . . . . 8 . . . . 
        . . . . . . . . . . 8 . . . . . 
        . . . . . . . . . 8 . . . . . . 
        . . . . . . . . 8 . . . . . . . 
        . . . . . . . 8 . . . . . . . . 
        . . . . . . 8 . . . . . . . . . 
        . . . . . 8 . . . . . . . . . . 
        . . . . 8 . . . . . . . . . . . 
        . . . 8 . . . . . . . . . . . . 
        . . 8 . . . . . . . . . . . . . 
        . 8 . . . . . . . . . . . . . . 
        8 . . . . . . . . . . . . . . . 
        `, SpriteKind.Reflector)
    tiles.placeOnTile(cursorSprite, tiles.getTileLocation(0, 0))
    cursorSprite.setFlag(SpriteFlag.Ghost, true)
    cursorBoxSprite = sprites.create(img`
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 
        2 . . . . . . . . . . . . . . 2 
        2 . . . . . . . . . . . . . . 2 
        2 . . . . . . . . . . . . . . 2 
        2 . . . . . . . . . . . . . . 2 
        2 . . . . . . . . . . . . . . 2 
        2 . . . . . . . . . . . . . . 2 
        2 . . . . . . . . . . . . . . 2 
        2 . . . . . . . . . . . . . . 2 
        2 . . . . . . . . . . . . . . 2 
        2 . . . . . . . . . . . . . . 2 
        2 . . . . . . . . . . . . . . 2 
        2 . . . . . . . . . . . . . . 2 
        2 . . . . . . . . . . . . . . 2 
        2 . . . . . . . . . . . . . . 2 
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 
        `, SpriteKind.CursorBox)
    cursorBoxSprite.setFlag(SpriteFlag.Ghost, true)
    cursorBoxSprite.z = 100
}
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    cursorSprite.x += -16
})
let projectile: Sprite = null
let emitters: Sprite[] = []
let energybars: StatusBarSprite[] = []
let allFull = false
let cursorBoxSprite: Sprite = null
let reflectorSprite: Sprite = null
let cursorSprite: Sprite = null
tiles.setTilemap(tiles.createTilemap(hex`0a0008000301030103010301030101030103010301030103030103010301030103010103010301030103010303010202020202020301010301030103010301030301030103010301030101030103010301030103`, img`
    . . . . . . . . . . 
    . . . . . . . . . . 
    . . . . . . . . . . 
    . . . . . . . . . . 
    . . 2 2 2 2 2 2 . . 
    . . . . . . . . . . 
    . . . . . . . . . . 
    . . . . . . . . . . 
    `, [myTiles.transparency16,myTiles.tile1,myTiles.tile3,myTiles.tile4], TileScale.Sixteen))
let emitterSprite = sprites.create(img`
    . . . . . . . c d . . . . . . . 
    . . . . . . . c d . . . . . . . 
    . . . . . . . c d . . . . . . . 
    . . . . . . . c b . . . . . . . 
    . . . . . . . f f . . . . . . . 
    . . . . . . . c 2 . . . . . . . 
    . . . . . . . f f . . . . . . . 
    . . . . . . . e 2 . . . . . . . 
    . . . . . . e e 4 e . . . . . . 
    . . . . . . e 2 4 e . . . . . . 
    . . . . . c c c e e e . . . . . 
    . . . . e e 2 2 2 4 e e . . . . 
    . . c f f f c c e e f f e e . . 
    . c c c c e e 2 2 2 2 4 2 e e . 
    c c c c c c e e 2 2 2 4 2 2 e e 
    c c c c c c e e 2 2 2 2 4 2 e e 
    `, SpriteKind.Emitter)
tiles.placeOnTile(emitterSprite, tiles.getTileLocation(7, 6))
sprites.setDataString(emitterSprite, "colour", "red")
emitterSprite = sprites.create(img`
    . . . . . . . c d . . . . . . . 
    . . . . . . . c d . . . . . . . 
    . . . . . . . c d . . . . . . . 
    . . . . . . . c b . . . . . . . 
    . . . . . . . f f . . . . . . . 
    . . . . . . . c 6 . . . . . . . 
    . . . . . . . f f . . . . . . . 
    . . . . . . . 8 6 . . . . . . . 
    . . . . . . 8 8 9 8 . . . . . . 
    . . . . . . 8 6 9 8 . . . . . . 
    . . . . . c c c 8 8 8 . . . . . 
    . . . . 8 8 6 6 6 9 8 8 . . . . 
    . . 8 f f f c c e e f f 8 8 . . 
    . 8 8 8 8 8 8 6 6 6 6 9 6 8 8 . 
    8 8 8 8 8 8 8 8 6 6 6 9 6 6 8 8 
    8 8 8 8 8 8 8 8 6 6 6 6 9 6 8 8 
    `, SpriteKind.Emitter)
tiles.placeOnTile(emitterSprite, tiles.getTileLocation(2, 6))
sprites.setDataString(emitterSprite, "colour", "blue")
let receiverSprite = sprites.create(img`
    . . . . . . . . . . . . . . . . 
    . . . . . . 4 4 4 4 . . . . . . 
    . . . . 4 4 4 5 5 4 4 4 . . . . 
    . . . 3 3 3 3 4 4 4 4 4 4 . . . 
    . . 4 3 3 3 3 2 2 2 1 1 4 4 . . 
    . . 3 3 3 3 3 2 2 2 1 1 5 4 . . 
    . 4 3 3 3 3 2 2 2 2 2 5 5 4 4 . 
    . 4 3 3 3 2 2 2 4 4 4 4 5 4 4 . 
    . 4 4 3 3 2 2 4 4 4 4 4 4 4 4 . 
    . 4 2 3 3 2 2 4 4 4 4 4 4 4 4 . 
    . . 4 2 3 3 2 4 4 4 4 4 2 4 . . 
    . . 4 2 2 3 2 2 4 4 4 2 4 4 . . 
    . . . 4 2 2 2 2 2 2 2 2 4 . . . 
    . . . . 4 4 2 2 2 2 4 4 . . . . 
    . . . . . . 4 4 4 4 . . . . . . 
    . . . . . . . . . . . . . . . . 
    `, SpriteKind.Receiver)
tiles.placeOnTile(receiverSprite, tiles.getTileLocation(2, 2))
sprites.setDataString(receiverSprite, "colour", "red")
let receiverStatusSprite = statusbars.create(16, 2, StatusBarKind.Energy)
receiverStatusSprite.attachToSprite(receiverSprite)
receiverStatusSprite.max = 5
receiverStatusSprite.value = 0
receiverSprite = sprites.create(img`
    . . . . . . . . . . . . . . . . 
    . . . . . . 6 6 6 6 . . . . . . 
    . . . . 6 6 6 5 5 6 6 6 . . . . 
    . . . 7 7 7 7 6 6 6 6 6 6 . . . 
    . . 6 7 7 7 7 8 8 8 1 1 6 6 . . 
    . . 7 7 7 7 7 8 8 8 1 1 5 6 . . 
    . 6 7 7 7 7 8 8 8 8 8 5 5 6 6 . 
    . 6 7 7 7 8 8 8 6 6 6 6 5 6 6 . 
    . 6 6 7 7 8 8 6 6 6 6 6 6 6 6 . 
    . 6 8 7 7 8 8 6 6 6 6 6 6 6 6 . 
    . . 6 8 7 7 8 6 6 6 6 6 8 6 . . 
    . . 6 8 8 7 8 8 6 6 6 8 6 6 . . 
    . . . 6 8 8 8 8 8 8 8 8 6 . . . 
    . . . . 6 6 8 8 8 8 6 6 . . . . 
    . . . . . . 6 6 6 6 . . . . . . 
    . . . . . . . . . . . . . . . . 
    `, SpriteKind.Receiver)
tiles.placeOnTile(receiverSprite, tiles.getTileLocation(7, 2))
sprites.setDataString(receiverSprite, "colour", "blue")
receiverStatusSprite = statusbars.create(16, 2, StatusBarKind.Energy)
receiverStatusSprite.attachToSprite(receiverSprite)
receiverStatusSprite.max = 5
receiverStatusSprite.value = 0
prepareCursor()
game.onUpdate(function () {
    cursorBoxSprite.setPosition(cursorSprite.x, cursorSprite.y)
})
game.onUpdateInterval(1000, function () {
    allFull = true
    energybars = statusbars.allOfKind(StatusBarKind.Energy)
    for (let 值 of energybars) {
        if (值.max != 值.value) {
            allFull = false
        }
        值.value += -1
    }
    if (allFull) {
        game.over(true)
    }
})
game.onUpdateInterval(500, function () {
    emitters = sprites.allOfKind(SpriteKind.Emitter)
    for (let 值 of emitters) {
        projectile = sprites.createProjectileFromSprite(img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            `, 值, 0, -50)
        sprites.setDataString(projectile, "colour", sprites.readDataString(值, "colour"))
        if (sprites.readDataString(值, "colour") == "red") {
            projectile.setImage(img`
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . 2 2 . . . . . . . 
                . . . . . . . 2 2 . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                `)
        } else {
            projectile.setImage(img`
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . 8 8 . . . . . . . 
                . . . . . . . 8 8 . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                `)
        }
    }
})
