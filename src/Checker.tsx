import { Board, Tile } from "./Board";

const getTile = (board: Board, x: number, y: number): Tile => {
    if (x < 0 || x >= board.width || y < 0 || y >= board.height) {
        return {active: false, highlighted: false, decorator: {type: '', color: ''}, x: -1, y: -1, state: 'disabled'}
    }
    return board.tiles[y][x]
}

const checkMill = (board: Board, tile: Tile): boolean => {
    const up = getTile(board, tile.x, tile.y-1)
    const down = getTile(board, tile.x, tile.y+1)
    const left = getTile(board, tile.x-1, tile.y)
    const right = getTile(board, tile.x+1, tile.y)

    let count = 0

    if (up.state !== 'disabled' && up.active === tile.active) { count++ }
    if (down.state !== 'disabled' && down.active === tile.active) { count++ }
    if (left.state !== 'disabled' && left.active === tile.active) { count++ }
    if (right.state !== 'disabled' && right.active === tile.active) { count++ }

    return tile.decorator.type.includes(`${count}`)
}

const checkDots = (board: Board, tile: Tile): boolean => {
    let visited: {x: number, y: number}[] = []
    let toVisit: {x: number, y: number}[] = []

    toVisit.push({x: tile.x, y: tile.y})

    let expectedScore = 0
    let actualScore = 0

    while (toVisit.length > 0) {
        const currentTile = getTile(board, toVisit[toVisit.length-1].x, toVisit[toVisit.length-1].y)
        visited.push(toVisit[toVisit.length-1])
        toVisit.pop()

        if (currentTile.state !== 'disabled' && currentTile.active === tile.active) {
            if (currentTile.decorator.type.includes("dots") && currentTile.decorator.color !== tile.decorator.color) {
                return false
            }

            if (currentTile.decorator.type.includes("undots")) {
                expectedScore -= parseInt(currentTile.decorator.type.slice(-1))
            } else if (currentTile.decorator.type.includes("dots")) {
                expectedScore += parseInt(currentTile.decorator.type.slice(-1))
            }

            actualScore++
            const up = getTile(board, currentTile.x, currentTile.y-1)
            if (!visited.some(e => (e.x === up.x && e.y === up.y)) && !toVisit.some(e => (e.x === up.x && e.y === up.y))) {
                toVisit.push({x: up.x, y: up.y})
            }

            const down = getTile(board, currentTile.x, currentTile.y+1)
            if (!visited.some(e => (e.x === down.x && e.y === down.y)) && !toVisit.some(e => (e.x === down.x && e.y === down.y))) {
                toVisit.push({x: down.x, y: down.y})
            }

            const left = getTile(board, currentTile.x-1, currentTile.y)
            if (!visited.some(e => (e.x === left.x && e.y === left.y)) && !toVisit.some(e => (e.x === left.x && e.y === left.y))) {
                toVisit.push({x: left.x, y: left.y})
            }

            const right = getTile(board, currentTile.x+1, currentTile.y)
            if (!visited.some(e => (e.x === right.x && e.y === right.y)) && !toVisit.some(e => (e.x === right.x && e.y === right.y))) {
                toVisit.push({x: right.x, y: right.y})
            }
        }
    }

    return expectedScore === actualScore || expectedScore === 0
}

const checkDiamond = (board: Board, tile: Tile): boolean => {
    let visited: {x: number, y: number}[] = []
    let toVisit: {x: number, y: number}[] = []

    toVisit.push({x: tile.x, y: tile.y})

    let actualScore = 0

    while (toVisit.length > 0) {
        const currentTile = getTile(board, toVisit[toVisit.length-1].x, toVisit[toVisit.length-1].y)
        visited.push(toVisit[toVisit.length-1])
        toVisit.pop()

        if (currentTile.state !== 'disabled' && currentTile.active === tile.active) {
            if (!currentTile.decorator.type.includes("mill") && currentTile.decorator.color === tile.decorator.color) {
                actualScore++
            }

            if (currentTile.decorator.type.includes("mill") && currentTile.decorator.type !== 'mill-0' && tile.decorator.color === "#d29a0e") {
                actualScore++
            }

            if (currentTile.decorator.type.includes("mill") && currentTile.decorator.type !== 'mill-4' && tile.decorator.color === "#a106ff") {
                actualScore++
            }

            const up = getTile(board, currentTile.x, currentTile.y-1)
            if (!visited.some(e => (e.x === up.x && e.y === up.y)) && !toVisit.some(e => (e.x === up.x && e.y === up.y))) {
                toVisit.push({x: up.x, y: up.y})
            }

            const down = getTile(board, currentTile.x, currentTile.y+1)
            if (!visited.some(e => (e.x === down.x && e.y === down.y)) && !toVisit.some(e => (e.x === down.x && e.y === down.y))) {
                toVisit.push({x: down.x, y: down.y})
            }

            const left = getTile(board, currentTile.x-1, currentTile.y)
            if (!visited.some(e => (e.x === left.x && e.y === left.y)) && !toVisit.some(e => (e.x === left.x && e.y === left.y))) {
                toVisit.push({x: left.x, y: left.y})
            }

            const right = getTile(board, currentTile.x+1, currentTile.y)
            if (!visited.some(e => (e.x === right.x && e.y === right.y)) && !toVisit.some(e => (e.x === right.x && e.y === right.y))) {
                toVisit.push({x: right.x, y: right.y})
            }
        }
    }

    return actualScore === 2
}

const getLineShape = (board: Board, tile: Tile): {x: number, y: number}[] => {
    let visited: {x: number, y: number}[] = []
    let toVisit: {x: number, y: number}[] = []
    let shape: {x: number, y: number}[] = []

    toVisit.push({x: tile.x, y: tile.y})

    while (toVisit.length > 0) {
        const currentTile = getTile(board, toVisit[toVisit.length-1].x, toVisit[toVisit.length-1].y)
        visited.push(toVisit[toVisit.length-1])
        toVisit.pop()
        if (currentTile.state !== 'disabled' && currentTile.active === tile.active) {
            shape.push({x: currentTile.x - tile.x, y: currentTile.y - tile.y})

            const up = getTile(board, currentTile.x, currentTile.y-1)
            if (!visited.some(e => (e.x === up.x && e.y === up.y)) && !toVisit.some(e => (e.x === up.x && e.y === up.y))) {
                toVisit.push({x: up.x, y: up.y})
            }

            const down = getTile(board, currentTile.x, currentTile.y+1)
            if (!visited.some(e => (e.x === down.x && e.y === down.y)) && !toVisit.some(e => (e.x === down.x && e.y === down.y))) {
                toVisit.push({x: down.x, y: down.y})
            }

            const left = getTile(board, currentTile.x-1, currentTile.y)
            if (!visited.some(e => (e.x === left.x && e.y === left.y)) && !toVisit.some(e => (e.x === left.x && e.y === left.y))) {
                toVisit.push({x: left.x, y: left.y})
            }

            const right = getTile(board, currentTile.x+1, currentTile.y)
            if (!visited.some(e => (e.x === right.x && e.y === right.y)) && !toVisit.some(e => (e.x === right.x && e.y === right.y))) {
                toVisit.push({x: right.x, y: right.y})
            }
        }
    }

    return shape
}

const sameShape = (shape1: {x: number, y: number}[], shape2: {x: number, y: number}[]): boolean => {
    if (shape1.length !== shape2.length) {
        return false
    }

    for (let i=0; i<shape1.length; i++) {
        if (shape1[i].x !== shape2[i].x || shape1[i].y !== shape2[i].y) {
            return false
        }
    }
    return true
}

const checkLine = (board: Board, tile: Tile): boolean => {
    const lineShape = getLineShape(board, tile)
    
    for (let i=0; i<board.width; i++) {
        for (let j=0; j<board.height; j++) {
            if (i === tile.x && j === tile.y) {
                continue
            }

            const currentTile = getTile(board, i, j)

            if (currentTile.decorator.type === "line") {
                const currentShape = getLineShape(board, currentTile)

                if (currentTile.decorator.color === tile.decorator.color && !sameShape(lineShape, currentShape)) {
                    return false
                }
                if (currentTile.decorator.color !== tile.decorator.color && sameShape(lineShape, currentShape)) {
                    return false
                }
            }
        }
    }

    return true
}

const rotate90Degrees = (shape: {x: number, y: number}[]): {x: number, y: number}[] => {
    return shape.map(point => {return {x: -point.y, y: point.x}})
}

const sameShapeRot = (shape1: {x: number, y: number}[], shape2: {x: number, y: number}[]): boolean => {
    if (shape1.length !== shape2.length) {
        return false
    }

    for (let i=0; i<4; i++) {
        let same = true
        for (let j=0; j<shape1.length; j++) {
            let found = false
            for (let k=0; k<shape2.length; k++) {
                if (shape1[j].x === shape2[k].x && shape1[j].y === shape2[k].y) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                same = false
                break;
            }
        }
        if (same) {
            return true
        }

        shape2 = rotate90Degrees(shape2)
    }
    for (let i=0; i<shape1.length; i++) {
        if (shape1[i].x !== shape2[i].x || shape1[i].y !== shape2[i].y) {
            return false
        }
    }
    return false
}

const checkLineRot = (board: Board, tile: Tile): boolean => {
    const lineShape = getLineShape(board, tile)
    
    for (let i=0; i<board.width; i++) {
        for (let j=0; j<board.height; j++) {
            if (i === tile.x && j === tile.y) {
                continue
            }

            const currentTile = getTile(board, i, j)

            if (currentTile.decorator.type.includes("line")) {
                const currentShape = getLineShape(board, currentTile)

                if (currentTile.decorator.color === tile.decorator.color && !sameShapeRot(lineShape, currentShape)) {
                    return false
                }
                if (currentTile.decorator.color !== tile.decorator.color && sameShapeRot(lineShape, currentShape)) {
                    return false
                }
            }
        }
    }

    return true
}

const checkTile = (board: Board, tile: Tile): boolean => {
    if (tile.decorator.type === '') {
        return true
    } else if (tile.decorator.type.includes('mill')) {
        return checkMill(board, tile)
    } else if (tile.decorator.type.includes('dots')) {
        return checkDots(board, tile)
    } else if (tile.decorator.type === "diamond") {
        return checkDiamond(board, tile)
    } else if (tile.decorator.type === "line") {
        return checkLine(board, tile)
    } else if (tile.decorator.type === "line-rot") {
        return checkLineRot(board, tile)
    }

    return true
}

const checkBoardSolution = (board: Board): Tile[] => {
    let wrongTiles: Tile[] = []

    for (let i=0;i<board.width;i++) {
        for (let j=0;j<board.height;j++) {
            const tile = getTile(board, i, j)
            const correct = checkTile(board, tile)
            if (!correct) {
                wrongTiles.push(tile)
            }
        }
    }

    return wrongTiles;
}

export { checkBoardSolution }