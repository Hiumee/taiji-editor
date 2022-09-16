export interface Board {
  width: number,
  height: number,
  tiles: Array<Array<Tile>>
}

export interface Decorator {
  type: string
  color: string
}

export interface Tile {
  active: boolean,
highlighted: boolean,
  decorator: Decorator,
  x: number,
  y: number,
  state: 'normal' | 'fixed' | 'disabled'
}

function newBoard(width: number = 3, height: number = 3): Board {
  let tiles: Array<Array<Tile>> = []
  for (let i = 0; i<height; i++) {
    let line: Array<Tile> = []
    for (let j = 0; j<width; j++) {
      
      line.push( {active: false, highlighted: false, decorator: {type: "", color: ""}, x: j, y: i, state: 'normal'} as const )
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
    line.map(tile => (tile === toggleTile ? {...tile, highlighted: (toggleTile.state !== 'disabled' ? false : tile.highlighted), decorator: (toggleTile.state !== 'disabled' ? {type: '', color: ''} : tile.decorator), active: (toggleTile.state !== 'disabled' ? false : tile.active), state: toggleTile.state !== 'disabled' ? 'disabled' : 'normal'} : tile))
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

function setDecorator(board: Board, toggleTile: Tile, decorator: Decorator): Board {
  return {...board, tiles: board.tiles.map(line => (
    line.map(tile => (tile === toggleTile ? {...tile, decorator: (decorator.type !== tile.decorator.type || decorator.color !== tile.decorator.color) ? decorator : {type: '', color: ''} } : tile))
  ))}
}

function setBoardSize(board: Board, width: number, height: number): Board {
  let newTiles: Tile[][] = []

  for (let i = 0; i<height; i++) {
    let line: Array<Tile> = []
    for (let j = 0; j<width; j++) {
      if (j<board.width && i<board.height) {
        line.push(board.tiles[i][j])
      } else {
        line.push( {active: false, highlighted: false, decorator: {type: "", color: ""}, x: j, y: i, state: 'normal'} as const )
      }
    }
    newTiles.push(line)
  }

  return {...board, width: width, height: height, tiles: newTiles}
}

export { newBoard, toggleTile, toggleFixTile, toggleDisableTile, toggleHightlight, resetBoard, setDecorator, setBoardSize };