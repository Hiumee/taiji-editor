import './Tiles.css';
import { Board, Tile } from './Board';
import TileComponent from './TileComponent';

interface props {
  board: Board,
  onTileHover: (tile: Tile) => void,
  onTileClick: (tile: Tile) => void
}

function Tiles({ board, onTileHover, onTileClick }: props) {
  return (
    <div className='tiles'>
      {
        board.tiles.map(
          (line) => 
          <div className='line'>
          {
            line.map(
              (tile) => <TileComponent 
                          tile={tile} 
                          mouseDownCallback={() => onTileClick(tile)}
                          hoverCallback={() => onTileHover(tile)}
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
