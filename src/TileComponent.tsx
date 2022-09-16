import './TileComponent.css';
import { Tile } from "./Board";

interface props {
  tile: Tile
  hoverCallback: () => void
  mouseDownCallback: (event: any) => void
}

function TileComponent({tile, hoverCallback, mouseDownCallback}: props) {
  const tileClass = `${tile.active ? 'active ' : ''}tile`;

  let border = ""

  if (tile.state === 'disabled') {
    border = 'tile-disabled-border'
  } else {
    if (tile.highlighted) {
      border = 'highlight '
    }
    
    if (tile.state === 'fixed') {
      border += 'tile-fixed-border'
    } else {
      border += 'tile-border'
    }
  }

  return (
    <div className='wrapper'>
      <div className={border} onMouseEnter={hoverCallback} onMouseDown={(e) => mouseDownCallback(e)}>
        <div className={tileClass}>

        </div>
      </div>
    </div>
  );
}

export default TileComponent;
