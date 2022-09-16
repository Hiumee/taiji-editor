import { title } from "process";
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

    if (up.active === tile.active) { count++ }
    if (down.active === tile.active) { count++ }
    if (left.active === tile.active) { count++ }
    if (right.active === tile.active) { count++ }
    
    return tile.decorator.type.includes(`${count}`)
}

const checkTile = (board: Board, tile: Tile): boolean => {
    if (tile.decorator.type === '') {
        return true
    } else if (tile.decorator.type.includes('mill')) {
        return checkMill(board, tile)
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