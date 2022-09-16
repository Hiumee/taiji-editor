import { useState } from 'react';
import html2canvas from 'html2canvas';
import './Editor.css';
import Tiles from './Tiles';
import { newBoard, Tile, toggleDisableTile, toggleFixTile, toggleTile, toggleHightlight, resetBoard } from './Board';
import { newControls, controlsMouseUp, controlsSetActiveFill, controlsMouseDown, controlsEnableEditMode, controlsDisableEditMode, controlsSetTool, controlsSetSize, controlsSetFillMode } from './Controls';
import Tools from './Tools';

function Editor() {
  const [controls, setControls] = useState(newControls());
  const [board, setBoard] = useState(newBoard(controls.width,controls.height));
  const [lastHoverTile, setLastHoverTile] = useState({x: 0, y: 0})

  const preventDragHandler = (e: any) => {
    e.preventDefault();
  }

  const handleTileClick = (tile: Tile) => { 
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
      }
    }
  }

  const handleTileMiddleClick = (tile: Tile) => {
    setBoard(toggleHightlight(board, tile, !tile.highlighted))
    setControls(controlsSetFillMode(controlsMouseDown(controlsSetActiveFill(controls, !tile.highlighted)), "highlight"))
  }

  const handleTileHover = (tile: Tile) => {
    setLastHoverTile({x: tile.x, y: tile.y})
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
    if (!controls.editMode) {
      setControls(controlsEnableEditMode(controls))
    } else {
      setControls(controlsDisableEditMode(controls))
    }
  }

  const setTool = (tool: string) => {
    if (controls.editMode) {
      setControls(controlsSetTool(controls, tool))
    }
  }

  const updateSize = (width: number, height: number) => {
    if (width !== controls.width || height !== controls.height) {
      setBoard(newBoard(height, width))
      setControls(controlsSetSize(controls, width, height))
    }
  }

  const openScreenshot = () => {
    const board = document.getElementById("board")
    if (board) {
      html2canvas(board).then(canvas => {
          const image = canvas.toDataURL()
          const w = window.open(image);
          if (w) {
            w.document.write('<iframe title="taiji" src="' + image  + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
          }
        }
      ) 
    }
  }

  const handleKeyDown = (e: any) => {
    console.log(e.keyCode)
    if (e.keyCode === 82) { // R
      setBoard(resetBoard(board))
    } else if (e.keyCode === 77) { // M
      if (!controls.mouseDown) {
        const tile = board.tiles[lastHoverTile.x][lastHoverTile.y]
        handleTileMiddleClick(tile)
      }
    }
  }

  const handleKeyUp = (e: any) => {
    if (e.keyCode === 77) { // M
      setControls(controlsMouseUp(controls))
    }
  }

  return (
    <div className="editor" onMouseUp={() => setControls(controlsMouseUp(controls))} 
      onDragStart={preventDragHandler}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      tabIndex={0}>
      <Tiles
        board={board}
        onTileClick={(event: any, tile: Tile) => { event.button === 0 ? handleTileClick(tile) : ( event.button === 1 && handleTileMiddleClick(tile)) }}
        onTileHover={(tile: Tile) => { handleTileHover(tile) }}
      />
      <div className='controls'>
        <div className='normal-controls'>
          <button className='screenshot' onClick={openScreenshot}>Screenshot</button>
        </div>
        <Tools onEditToggle={toggleEditMode} updateSize={updateSize} controls={controls} setTool={setTool} />
      </div>
    </div>
  );
}

export default Editor;
