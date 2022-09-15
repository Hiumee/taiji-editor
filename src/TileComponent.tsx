import './TileComponent.css';
import { Tile } from "./Board";

interface props {
  tile: Tile
  hoverCallback: () => void
  mouseDownCallback: () => void
}

function TileComponent({tile, hoverCallback, mouseDownCallback}: props) {
  const tileClass = `${tile.active ? 'active ' : ''}tile`;
  const border = tile.state === 'fixed' ? 'tile-fixed-border' : 'tile-border';

  return (
    <div className='wrapper'>
      { tile.state !== "disabled" &&
      <div className={border} onMouseEnter={hoverCallback} onMouseDown={mouseDownCallback}>
        <div className={tileClass}>

        </div>
      </div>
      }
    </div>
  );
}

export default TileComponent;
