export interface Board {
  width: number,
  height: number,
  tiles: Tile[][]
  signs: Tile[]
}

export interface Decorator {
  type: string
  color: string
  movable?: boolean
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
const DECORATORS_REV = { 'dots-1': "A", 'dots-2':  "B", 'dots-3':  "C", 'dots-4':  "D", 'dots-5':  "E", 'dots-6':  "F", 'dots-7':  "G", 'dots-8':  "H", 'dots-9':  "I", 'undots-1':  "J", 'undots-2':  "K", 'undots-3':  "L", 'undots-4':  "M", 'undots-5':  "N", 'undots-6':  "O", 'undots-7':  "P", 'undots-8':  "Q", 'undots-9':  "R", 'diamond':  "S", 'line':  "T", 'line-rot':  "U", 'mill-0':  "V", 'mill-1':  "W", 'mill-2':  "X", 'mill-3':  "Y",  'mill-4':  "Z"}
const COLORS = { "r": "#ff0000", "o": "#ff7f00", "y": "#d29a0e", "g": "#00ff00", "b": "#00ffff", "p": "#a106ff", "w": "#000000", "k": "#ffffff" }
const COLORS_rev = { "#ff0000": "r", "#ff7f00": "o", "#d29a0e": "y", "#00ff00": "g", "#00ffff": "b", "#a106ff": "p", "#000000": "w", "#ffffff": "k" }

function newBoard(width: number = 3, height: number = 3): Board {
  let tiles: Tile[][] = []
  for (let i = 0; i<height; i++) {
    let line: Array<Tile> = []
    for (let j = 0; j<width; j++) {
      
      line.push( {active: false, highlighted: false, decorator: {type: "", color: ""}, x: j, y: i, state: 'normal'} as const )
    }
    tiles.push(line)
  }
  return { width: width, height: height, tiles: tiles, signs: [] }
}

function saveSigns(signs: Tile[]): string {
  let code = ""

  for (let i=0; i<signs.length; i++) {
    const tile = signs[i]

    let options = 0
    options += tile.state === "fixed" ? 4 : 0
    options += tile.active ? 2 : 0
    options = tile.state === "disabled" ? 8 : options

    if (tile.decorator.type !== "") {
      code += DECORATORS_REV[tile.decorator.type]
      if (!tile.decorator.type.includes("mill")) {
        code += COLORS_rev[tile.decorator.color]
      }
    }

    code += options.toString()
  }

  return code
}


function loadSigns(data: string): Tile[] {
  // https://github.com/sangchoo1201/taiji_maker/blob/master/src/file.py
  let tiles: Tile[] = []
  
  let i = 0;
  let col = 0;

  while (data.includes("+")) {
    const pi = data.indexOf("+")
    const count = data.charCodeAt(pi+1) - 64
    data = data.slice(0,pi) + '0'.repeat(count) + data.slice(pi+2)
  }

  while (data.includes("-")) {
    const pi = data.indexOf("-")
    const count = data.charCodeAt(pi+1) - 64
    data = data.slice(0,pi) + '8'.repeat(count) + data.slice(pi+2)
  }

  while (i < data.length) {
    let tile: Tile = {active: false, highlighted: false, decorator: {type: "", color: "", movable: true}, x: col, y: -1, state: 'normal'} as const
    col++

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
      const fixed = option >> 2 === 1
      const active = (option >> 1) % 2 === 1
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const hidden = (option % 2) === 1 // ignore for now
      const disabled = option === 8

      if (fixed && !disabled) {
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

    tiles.push(tile)
  }

  return tiles
}

function saveMap(board: Board): string {
  let code = `${board.width}:`
  
  for (let j=0; j<board.height; j++) {
    for (let i=0; i<board.width; i++) {
      const tile = board.tiles[j][i]

      let options = 0
      options += tile.state === "fixed" ? 4 : 0
      options += tile.active ? 2 : 0
      options = tile.state === "disabled" ? 8 : options

      if (tile.decorator.type !== "") {
        code += DECORATORS_REV[tile.decorator.type]
        if (!tile.decorator.type.includes("mill")) {
          code += COLORS_rev[tile.decorator.color]
        }
      }
      code += options.toString()
    }
  }

  // Compress
  for (let i=26; i>1; i--) {
    code = code.replaceAll("0".repeat(i), "+"+String.fromCharCode(64+i))
    code = code.replaceAll("8".repeat(i), "-"+String.fromCharCode(64+i))
  }

  return code
}

function loadMap(map: string): Board {
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
    const pi = data.indexOf("-")
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
      const fixed = option >> 2 === 1
      const active = (option >> 1) % 2 === 1
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const hidden = (option % 2) === 1 // ignore for now
      const disabled = option === 8

      if (fixed && !disabled) {
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

  if (tiles[tiles.length-1].length !== 0) {
    throw new Error("Invalid code")
  }
  tiles = tiles.slice(0, -1)

  return {width: width, height: tiles.length, tiles: tiles, signs: []}
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
  if (toggleTile.y === -1) {
    return {...board, signs: board.signs.map(tile => tile.x === toggleTile.x ? {...tile, highlighted: !tile.highlighted} : tile)}
  }
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
  if (toggleTile.y === -1) {
    return {...board, signs: board.signs.map(tile => tile.x === toggleTile.x ? {...tile, decorator: (decorator.type !== tile.decorator.type || decorator.color !== tile.decorator.color) ? {...decorator, movable: true} : {type: '', color: ''} } : tile)}
  }
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

function addSign(board: Board): Board {
  return {...board, signs: [...board.signs, {active: false, highlighted: false, decorator: {type: "", color: "", movable: true}, x: board.signs.length, y: -1, state: "normal"}]}
}

function removeSign(board: Board): Board {
  return {...board, signs: board.signs.slice(0,-1)}
}

function fixAll(board: Board): Board {
  return {...board, tiles: board.tiles.map(line =>
    line.map( tile => {
      if (tile.state === "normal") {
        return {...tile, state: "fixed"}
      }
      if (tile.state === "fixed") {
        return {...tile, state: "normal"}
      }
      return tile;
    })
  )}
}

function setSigns(board: Board, signs: Tile[]): Board {
  return {...board, signs: signs}
}

export { newBoard, toggleTile, toggleFixTile, toggleDisableTile, toggleHightlight, resetBoard, setDecorator, setBoardSize, loadMap, saveMap, addSign, removeSign, fixAll, loadSigns, saveSigns, setSigns };
