export interface Board {
  width: number,
  height: number,
  tiles: Array<Array<Tile>>
}

export interface Tile {
  active: boolean,
  highlighted: boolean,
  decorator: string,
  x: number,
  y: number,
  state: 'normal' | 'fixed' | 'disabled'
}

function newBoard(width: number = 3, height: number = 3): Board {
  let tiles = []
  for (let i = 0; i<width; i++) {
    let line = []
    for (let j = 0; j<height; j++) {
      
      line.push( {active: false, highlighted: false, decorator: "", x: i, y: j, state: 'normal'} as const )
    }
    tiles.push(line)
  }
  return { width: width, height: height, tiles: tiles }
}

function toggleTile(board: Board, toggleTile: Tile, fill: boolean): Board {
  return {...board, tiles: board.tiles.map(line => (
    line.map(tile => (tile === toggleTile ? {...tile, active: fill} : tile))
  ))}
}

function toggleFixTile(board: Board, toggleTile: Tile): Board {
  return {...board, tiles: board.tiles.map(line => (
    line.map(tile => (tile === toggleTile ? {...tile, state: toggleTile.state === 'normal' ? 'fixed' : 'normal'} : tile))
  ))}
}

function toggleDisableTile(board: Board, toggleTile: Tile): Board {
  return {...board, tiles: board.tiles.map(line => (
    line.map(tile => (tile === toggleTile ? {...tile, active: (toggleTile.state !== 'disabled' ? false : tile.active), state: toggleTile.state !== 'disabled' ? 'disabled' : 'normal'} : tile))
  ))}
}

function toggleHightlight(board: Board, toggleTile: Tile, state: boolean): Board {
  return {...board, tiles: board.tiles.map(line => (
    line.map(tile => (tile === toggleTile ? {...tile, highlighted: state} : tile))
  ))}
}

function resetBoard(board: Board): Board {
  return {...board, tiles: board.tiles.map(line => (
    line.map(tile => { return {...tile, highlighted: false, active: (tile.state === "normal" ? false : tile.active) }})
  ))}
}

export { newBoard, toggleTile, toggleFixTile, toggleDisableTile, toggleHightlight, resetBoard };