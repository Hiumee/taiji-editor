import './Tiles.css';
import { Board, Tile } from './Board';
import TileComponent from './TileComponent';

interface props {
  board: Board,
  onTileHover: (tile: Tile) => void,
  onTileClick: (event: any, tile: Tile) => void,
  incorrectTiles: Tile[]
}

function Tiles({ board, onTileHover, onTileClick, incorrectTiles }: props) {
  return (
    <div className='tiles no-select' id="board">
      {
        board.tiles.map(
          (line, index) => 
          <div className='line' key={index}>
          {
            line.map(
              (tile) => <TileComponent 
                          key={tile.x}
                          tile={tile} 
                          mouseDownCallback={(e: any) => onTileClick(e, tile)}
                          hoverCallback={() => onTileHover(tile)}
                          incorrect={incorrectTiles.includes(tile)}
                        />
            )
          }
          </div>
        )
      }
    </div>
  );
}

export default Tiles;
