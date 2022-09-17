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

const DECORATORS = { "A": 'dots-1', "B": 'dots-2', "C": 'dots-3', "D": 'dots-4', "E": 'dots-5', "F": 'dots-6', "G": 'dots-7', "H": 'dots-8', "I": 'dots-9', "J": 'undots-1',
  "K": 'undots-2', "L": 'undots-3', "M": 'undots-4', "N": 'undots-5', "O": 'undots-6', "P": 'undots-7', "Q": 'undots-8', "R": 'undots-9', "S": 'diamond', "T": 'line', "U": 'line-rot',
  "V": 'mill-0', "W": 'mill-1', "X": 'mill-2', "Y": 'mill-3', "Z": 'mill-4'}
const COLORS = { "r": "#ff0000", "o": "#ff7f00", "y": "#d29a0e", "g": "#00ff00", "b": "#00ffff", "p": "#a106ff", "w": "#000000", "k": "#ffffff" }

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

function loadMap(map: string) {
  // https://github.com/sangchoo1201/taiji_maker/blob/master/src/file.py
  const segments = map.split(":")
  const width = parseInt(segments[0])
  let data = segments[1]

  let tiles: Tile[][] = [[]]
  
  let i = 0;
  let line = 0;
  let col = 0;

  while (data.includes("+")) {
    const pi = data.indexOf("+")
    const count = data.charCodeAt(pi+1) - 64
    data = data.slice(0,pi) + '0'.repeat(count) + data.slice(pi+2)
  }

  while (data.includes("-")) {
    const pi = data.indexOf("+")
    const count = data.charCodeAt(pi+1) - 64
    data = data.slice(0,pi) + '8'.repeat(count) + data.slice(pi+2)
  }

  while (i < data.length) {
    let tile: Tile = {active: false, highlighted: false, decorator: {type: "", color: ""}, x: col, y: line, state: 'normal'} as const

    if (data[i] !== '0') {
      if (65 <= data.charCodeAt(i) && data.charCodeAt(i) <= 90) {
        tile.decorator.type = DECORATORS[data[i]]
        i++
      }
      if ("roygbpkw".includes(data[i])) {
        tile.decorator.color = COLORS[data[i]]
        i++
      }

      const option = parseInt(data[i])
      const fiexd = option >> 2 === 1
      const active = (option >> 1) % 2 === 1
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const hidden = (option % 2) === 1 // ignore for now
      const disabled = option === 8

      if (fiexd && !disabled) {
        tile = { ...tile, state: 'fixed' }
      }
      if (disabled) {
        tile = { ...tile, state: 'disabled' }
      }
      if (active) {
        tile = { ...tile, active: active }
      }
    }
    i++

    tiles[tiles.length-1].push(tile)

    col++
    if (tiles[tiles.length-1].length === width) {
      col = 0
      line++
      tiles.push([])
    }
  }

  tiles = tiles.slice(0, -1)

  return {width: width, height: tiles.length, tiles: tiles}
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

export { newBoard, toggleTile, toggleFixTile, toggleDisableTile, toggleHightlight, resetBoard, setDecorator, setBoardSize, loadMap };