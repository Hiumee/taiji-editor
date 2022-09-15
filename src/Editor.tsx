import { useState } from 'react';
import './Editor.css';
import Tiles from './Tiles';
import { newBoard, Tile, toggleDisableTile, toggleFixTile, toggleTile } from './Board';
import { newControls, controlsMouseUp, controlsSetActiveFill, controlsMouseDown, controlsEnableEditMode, controlsDisableEditMode, controlsSetTool, controlsSetSize } from './Controls';
import Tools from './Tools';


function Editor() {
  const [controls, setControls] = useState(newControls());
  const [board, setBoard] = useState(newBoard(controls.width,controls.height));

  const preventDragHandler = (e: any) => {
    e.preventDefault();
  }

  const handleTileClick = (tile: Tile) => {
    if (!controls.editMode) {
      if (tile.state === 'normal') {
        setBoard(toggleTile(board, tile, !tile.active));
      }
      setControls(controlsMouseDown(controlsSetActiveFill(controls, !tile.active)))
    } else {
      switch (controls.tool) {
        case "fixer":
          setBoard(toggleFixTile(board, tile))
          break;
        case "toggler":
          setBoard(toggleTile(board, tile, !tile.active));
          break;
        case "disable":
          setBoard(toggleDisableTile(board, tile))
      }
    }
  }

  const handleTileHover = (tile: Tile) => {
    if (!controls.editMode) {
      if (tile.state === 'normal' && controls.mouseDown) {
        setBoard(toggleTile(board, tile, controls.activeFill))
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

  return (
    <div className="editor" onMouseUp={() => setControls(controlsMouseUp(controls))} 
      onDragStart={preventDragHandler}>
      <Tiles
        board={board}
        onTileClick={(tile: Tile) => { handleTileClick(tile) }}
        onTileHover={(tile: Tile) => { handleTileHover(tile) }}
      />
      <Tools onEditToggle={toggleEditMode} updateSize={updateSize} controls={controls} setTool={setTool} />
    </div>
  );
}

export default Editor;
