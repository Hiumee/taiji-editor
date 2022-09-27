import { useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import './Editor.css';
import Tiles from './Tiles';
import { newBoard, Tile, toggleDisableTile, toggleFixTile, toggleTile, toggleHightlight, resetBoard, setDecorator, setBoardSize, loadMap, saveMap, addSign, removeSign, fixAll, setSigns, saveSigns, loadSigns } from './Board';
import { newControls, controlsMouseUp, controlsSetActiveFill, controlsMouseDown, controlsEnableEditMode, controlsDisableEditMode, controlsSetTool, controlsSetSize, controlsSetFillMode, controlsSetColor } from './Controls';
import Tools from './Tools';
import { checkAllSignsUsed, checkBoardSolution } from './Checker';
import ToolTiles from './ToolTiles';

function Editor() {
  const [controls, setControls] = useState(newControls());
  const [board, setBoard] = useState(newBoard(controls.width, controls.height));
  const [lastHoverTile, setLastHoverTile] = useState({ x: 0, y: 0 })
  const [checkResult, setCheckResult] = useState("Result")
  const [incorrectTiles, setIncorrectTiles] = useState<Tile[]>([])
  const [showEditMode, setShowEditMode] = useState(true)
  const [puzzleCode, setPuzzleCode] = useState("")
  const [holdingSign, setHoldingSign] = useState<Tile>()
  const [signsCode, setSignsCode] = useState("")

  useEffect(() => {
    const windowUrl = window.location.search;
    const params = new URLSearchParams(windowUrl);
    const code = params.get('m')
    let signs = ""

    if (params.get("p") !== null) {
      setShowEditMode(false)
    }

    if (code) {
      const segments = code.split(":")
      if (segments.length < 2) {
        return
      }
      const map = segments[0]+":"+segments[1]
      if (segments.length === 3) {
        signs = segments[2]
      }
      try {
        const mapCode = map.replaceAll(' ', '+')
        const loadedBoard = loadMap(mapCode)
        setPuzzleCode(mapCode)
        if (signs !== "") {
          setSignsCode(signs)
          setBoard(setSigns(loadedBoard, loadSigns(signs)))
        } else {
          setBoard(loadedBoard)
        }
        setControls(controlsSetSize(controls, loadedBoard.width, loadedBoard.height))
      } catch {}
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const preventDragHandler = (e: any) => {
    e.preventDefault();
  }

  const handleTileClick = (tile: Tile) => {
    setIncorrectTiles([])
    if (!controls.editMode) {
      if (tile.decorator.movable && tile.decorator.type !== "") {
        if (tile.decorator.type !== "") {
          setHoldingSign(tile)
        }
      } else {
        if (holdingSign && tile.decorator.type === "") {
          setBoard(setDecorator(setDecorator(board, tile, { type: holdingSign.decorator.type, color: holdingSign.decorator.color, movable: true }), holdingSign, {type: "", color: ""}))
          setHoldingSign(undefined)
        }
        else {
          if (tile.state === 'normal') {
            setBoard(toggleTile(board, tile, !tile.active));
          }
          setControls(controlsSetFillMode(controlsMouseDown(controlsSetActiveFill(controls, !tile.active)), "active"))
        }
      }
    } else {
      switch (controls.tool) {
        case "fixer":
          setBoard(toggleFixTile(board, tile))
          break;
        case "toggler":
          if (tile.state !== 'disabled') {
            setBoard(toggleTile(board, tile, !tile.active))
          }
          break;
        case "disable":
          setBoard(toggleDisableTile(board, tile))
          break;
        default:
          setBoard(setDecorator(board, tile, { type: controls.tool, color: controls.color }))
          break;
      }
    }
  }

  const handleTileMiddleClick = (tile: Tile) => {
    setIncorrectTiles([])
    if (!controls.editMode) {
      setBoard(toggleHightlight(board, tile, !tile.highlighted))
      setControls(controlsSetFillMode(controlsMouseDown(controlsSetActiveFill(controls, !tile.highlighted)), "highlight"))
    } else {
      setBoard(setDecorator(board, tile, { type: '', color: '' }))
    }
  }

  const handleTileHover = (tile: Tile) => {
    setLastHoverTile({ x: tile.y, y: tile.x })
    if (!controls.editMode) {
      if (controls.fillMode === "active" && tile.state === 'normal' && controls.mouseDown) {
        setBoard(toggleTile(board, tile, controls.activeFill))
      }
      if (controls.fillMode === "highlight" && tile.state !== 'disabled' && controls.mouseDown) {
        setBoard(toggleHightlight(board, tile, controls.activeFill))
      }
    }
  }

  const toggleEditMode = () => {
    setIncorrectTiles([])
    if (!controls.editMode) {
      setControls(controlsEnableEditMode(controls))
    } else {
      setControls(controlsDisableEditMode(controls))
    }
  }

  const setTool = (tool: string) => {
    setIncorrectTiles([])
    if (controls.editMode) {
      setControls(controlsSetTool(controls, tool))
    }
  }

  const updateSize = (width: number, height: number) => {
    setIncorrectTiles([])
    if (width !== controls.width || height !== controls.height) {
      setBoard(setBoardSize(board, width, height))
      setControls(controlsSetSize(controls, width, height))
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const openScreenshot = () => {
    // TODO: Fix images not showing - Switch to svg?
    const boardElement = document.getElementById("board")
    if (boardElement) {
      html2canvas(boardElement).then(canvas => {
        const image = canvas.toDataURL('image/png')
        const w = window.open();
        if (w) {
          w.document.write('<iframe title="taiji" src="' + image + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
        }
      }
      )
    }
  }

  const handleKeyDown = (e: any) => {
    setIncorrectTiles([])
    if (e.keyCode === 82) { // R
      setBoard(resetBoard(board))
    } else if (e.keyCode === 77) { // M
      if (!controls.mouseDown) {
        if (lastHoverTile.x === -1) {
          const tile = board.signs[lastHoverTile.y]
          handleTileMiddleClick(tile)
        } else {
          const tile = board.tiles[lastHoverTile.x][lastHoverTile.y]
          handleTileMiddleClick(tile)
        }
      }
    } else if (e.keyCode === 32) { // Space
      checkSolution()
    }
  }

  const handleKeyUp = (e: any) => {
    if (e.keyCode === 77) { // M
      setControls(controlsMouseUp(controls))
    }
  }

  const selectColor = (color: string) => {
    setIncorrectTiles([])
    setControls(controlsSetColor(controls, color))
  }

  const checkSolution = () => {
    const wrongTiles = checkBoardSolution(board)
    const usedAll = checkAllSignsUsed(board)
    setCheckResult((wrongTiles.length === 0 && usedAll ? 'Correct' : 'Wrong'))
    setIncorrectTiles(wrongTiles)
  }

  const clearBoard = () => {
    setBoard(newBoard(controls.width, controls.height))
  }

  const openPuzzle = (playMode: boolean) => {
    window.location.href = `./?${playMode ? 'p&' : ''}m=${puzzleCode}${board.signs.length > 0 ? ':'+signsCode : ''}`
  }

  const generateCode = () => {
    setPuzzleCode(saveMap(board))
    setSignsCode(saveSigns(board.signs))
  }

  return (
    <div className="editor" onMouseUp={() => setControls(controlsMouseUp(controls))}
      onDragStart={preventDragHandler}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      tabIndex={0}>
      <div>
        { board.signs.length > 0 &&
          <ToolTiles 
            onTileClick={(event: any, tile: Tile) => { event.button === 0 ? handleTileClick(tile) : (event.button === 1 && handleTileMiddleClick(tile)) }}
            onTileHover={(tile: Tile) => { handleTileHover(tile) }}
            board={board}
          />
        }
        <Tiles
          board={board}
          onTileClick={(event: any, tile: Tile) => { event.button === 0 ? handleTileClick(tile) : (event.button === 1 && handleTileMiddleClick(tile)) }}
          onTileHover={(tile: Tile) => { handleTileHover(tile) }}
          incorrectTiles={incorrectTiles}
        />
      </div>
      <div className='controls'>
        <div className='normal-controls'>
          {
            // <button className='screenshot' onClick={openScreenshot}>Screenshot</button>
          }
          <button className='check' onClick={checkSolution}>Check</button>
          <div>{checkResult}</div>
        </div>
        { showEditMode &&
          <Tools
            onEditToggle={toggleEditMode}
            updateSize={updateSize}
            controls={controls}
            setTool={setTool}
            selectColor={selectColor}
            clearBoard={clearBoard}
            addSign={() => controls.editMode && setBoard(addSign(board))}
            removeSign={() => controls.editMode && setBoard(removeSign(board))}
            fixAll={() => setBoard(fixAll(board))}
          />
        }
        <div className="puzzle-open">
          Open puzzle
          <input onChange={(e) => setPuzzleCode(e.target.value)} value={`${puzzleCode}${signsCode !== "" ? ':'+signsCode : ''}`} />
          <button onClick={() => openPuzzle(true)}>Play</button>
          <button onClick={() => openPuzzle(false)}>Edit</button>
          <button onClick={() => generateCode()}>Get code</button>
        </div>
      </div>
    </div>
  );
}

export default Editor;
