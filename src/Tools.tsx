import { Controls } from './Controls';
import Tool from './Tool';
import './Tools.css';

interface props {
  onEditToggle: () => void
  controls: Controls
  setTool: (tool: string) => void
  updateSize: (width: number, height: number) => void
}

function Tools({onEditToggle, controls, setTool, updateSize}: props) {

  const mainClass = `${controls.editMode ? 'active-background' : 'inactive-background'} tools`;


  return (
    <div className={mainClass}>
      <div className='toggle-field'>
        <label className="switch">
          <input type="checkbox" onClick={onEditToggle} />
          <span className="slider"></span>
        </label>
        <div>Edit mode</div>
      </div>
      <div className='size-container'>
        Width <input className="size-input" type="number" min={1} onChange={(e: any) => updateSize(e.target.value, controls.height)} value={controls.width}></input>
        Height <input className="size-input" type="number" min={1} onChange={(e: any) => updateSize(controls.width, e.target.value)} value={controls.height}></input>
      </div>
      <div className="picker">
        <Tool controls={controls} setTool={setTool} name={'Toggler'} tool={'toggler'}  />
        <Tool controls={controls} setTool={setTool} name={'Fixer'} tool={'fixer'}  />
        <Tool controls={controls} setTool={setTool} name={'Disable'} tool={'disable'}  />
      </div>
    </div>
  );
}

export default Tools;
