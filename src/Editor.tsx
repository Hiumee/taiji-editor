import { useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import './Editor.css';
import Tiles from './Tiles';
import { newBoard, Tile, toggleDisableTile, toggleFixTile, toggleTile, toggleHightlight, resetBoard, setDecorator, setBoardSize, loadMap } from './Board';
import { newControls, controlsMouseUp, controlsSetActiveFill, controlsMouseDown, controlsEnableEditMode, controlsDisableEditMode, controlsSetTool, controlsSetSize, controlsSetFillMode, controlsSetColor } from './Controls';
import Tools from './Tools';
import { checkBoardSolution } from './Checker';

function Editor() {
  const [controls, setControls] = useState(newControls());
  const [board, setBoard] = useState(newBoard(controls.width, controls.height));
  const [lastHoverTile, setLastHoverTile] = useState({ x: 0, y: 0 })
  const [checkResult, setCheckResult] = useState("Result here")
  const [incorrectTiles, setIncorrectTiles] = useState<Tile[]>([])

  useEffect(() => {
    const windowUrl = window.location.search;
    const params = new URLSearchParams(windowUrl);
    const map = params.get('m')

    if (map) {
      //TODO: catch errors
      const loadedBoard = loadMap(map.replaceAll(' ', '+'))
      setBoard(loadedBoard)
      setControls(controlsSetSize(controls, loadedBoard.width, loadedBoard.height))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const preventDragHandler = (e: any) => {
    e.preventDefault();
  }

  const handleTileClick = (tile: Tile) => {
    setIncorrectTiles([])
    if (!controls.editMode) {
      if (tile.state === 'normal') {
        setBoard(toggleTile(board, tile, !tile.active));
      }
      setControls(controlsSetFillMode(controlsMouseDown(controlsSetActiveFill(controls, !tile.active)), "active"))
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
        const tile = board.tiles[lastHoverTile.x][lastHoverTile.y]
        handleTileMiddleClick(tile)
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
    setCheckResult((wrongTiles.length === 0 ? 'Correct' : 'Wrong'))
    setIncorrectTiles(wrongTiles)
  }

  const clearBoard = () => {
    setBoard(newBoard(controls.width, controls.height))
  }

  return (
    <div className="editor" onMouseUp={() => setControls(controlsMouseUp(controls))}
      onDragStart={preventDragHandler}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      tabIndex={0}>
      <Tiles
        board={board}
        onTileClick={(event: any, tile: Tile) => { event.button === 0 ? handleTileClick(tile) : (event.button === 1 && handleTileMiddleClick(tile)) }}
        onTileHover={(tile: Tile) => { handleTileHover(tile) }}
        incorrectTiles={incorrectTiles}
      />
      <div className='controls'>
        <div className='normal-controls'>
          {
            // <button className='screenshot' onClick={openScreenshot}>Screenshot</button>
          }
          <button className='check' onClick={checkSolution}>Check</button>
          <div>{checkResult}</div>
        </div>
        <Tools onEditToggle={toggleEditMode} updateSize={updateSize} controls={controls} setTool={setTool} selectColor={selectColor} clearBoard={clearBoard} />
      </div>
    </div>
  );
}

export default Editor;
