import './TileComponent.css';
import { Tile } from "./Board";
import ImageFilter from 'react-image-filter'

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

  const hexToColor = (hex: string) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : [0, 0, 0];
  }

  return (
    <div className='wrapper'>
      <div className={border} onMouseEnter={hoverCallback} onMouseDown={(e) => mouseDownCallback(e)}>
        <div className={tileClass}>
          { (tile.decorator && tile.state !== 'disabled') &&
            (
            tile.decorator.type.includes("mill") ?
              <img className="decorator" src={`./symbols/${tile.decorator.type}.png`} />
            :
              <ImageFilter
                image={`./symbols/${tile.decorator.type}.png`}
                filter={ 'duotone' } // see docs beneath
                colorOne={ [0, 0, 0] }
                colorTwo={ hexToColor(tile.decorator.color) }
                className="decorator"
              />
            )
          }
        </div>
      </div>
    </div>
  );
}

export default TileComponent;
