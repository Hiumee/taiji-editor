import { Board, Tile } from './Board';
import TileComponent from './TileComponent';
import './ToolTiles.css';

interface props {
  board: Board
  onTileClick: (event: any, tile: Tile) => void
  onTileHover: (tile: Tile) => void
}

function ToolTiles({board, onTileClick, onTileHover}: props) {
    return (
        <div className="toolTiles" style={{width: `${50*board.width}px`}}>
            { 
            board.signs.map(tile =>
                <TileComponent
                    key={tile.x}
                    tile={tile}
                    hoverCallback={() => onTileHover(tile)}
                    mouseDownCallback={(e: any) => onTileClick(e, tile)}
                    incorrect={false}
                />
            )
            }
        </div>
    )
}

export default ToolTiles;
