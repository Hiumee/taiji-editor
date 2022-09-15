import { Controls } from './Controls';
import './Tool.css';

interface props {
  controls: Controls
  setTool: (tool: string) => void
  name: string
  tool: string
}

function Tool({controls, setTool, name, tool}: props) {
  const mainClass = `${controls.tool === tool ? 'current ' : ''}item`;

  return (
    <div className={mainClass} onClick={() => setTool(tool)}>
      {name}
    </div>
  );
}

export default Tool;
