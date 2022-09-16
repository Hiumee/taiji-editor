import { Controls } from './Controls';
import './Tool.css';
import ImageFilter from 'react-image-filter'

interface props {
  controls: Controls
  setTool: (tool: string) => void
  name: string
  tool: string
  image?: string
}

function Tool({controls, setTool, name, tool, image}: props) {
  const mainClass = `${controls.tool === tool ? 'current ' : ''}item`;

  return (
    <div className={mainClass} onClick={() => setTool(tool)}>
      { image ? 
        <>
        {
        image.includes("mill") ?
        <img className="decorator-tool" src={`./symbols/${image}.png`} />
        :
        <ImageFilter
          image={`./symbols/${image}.png`}
          filter={ 'duotone' } // see docs beneath
          colorOne={ [0, 0, 0] }
          colorTwo={ [0, 0, 0] }
          className="decorator-tool"
        />
        }
        </> :
        <>
          {name}
        </>
      }
    </div>
  );
}

export default Tool;
