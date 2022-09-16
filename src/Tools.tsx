import Color from './Color';
import { Controls } from './Controls';
import Tool from './Tool';
import './Tools.css';

interface props {
  onEditToggle: () => void
  controls: Controls
  setTool: (tool: string) => void
  updateSize: (width: number, height: number) => void
  selectColor: (color: string) => void
  clearBoard: () => void
}

function Tools({onEditToggle, controls, setTool, updateSize, selectColor, clearBoard}: props) {

  const mainClass = `${controls.editMode ? 'active-background' : 'inactive-background'} tools`;


  return (
    <div className={mainClass}>
      <div className='toggle-field'>
        <label className="switch">
          <input type="checkbox" onClick={onEditToggle} />
          <span className="slider"></span>
        </label>
        <div>Edit mode</div>
        <div>
          <button onClick={clearBoard}>New board</button>
        </div>  
      </div>
      <div className='size-container'>
        Width <input className="size-input" type="number" min={1} onChange={(e: any) => updateSize(e.target.value, controls.height)} value={controls.width}></input>
        Height <input className="size-input" type="number" min={1} onChange={(e: any) => updateSize(controls.width, e.target.value)} value={controls.height}></input>
      </div>
      <div className="color-picker">
        <Color selectColor={selectColor} color="#000000" selected={controls.color} />
        <Color selectColor={selectColor} color="#ff0000" selected={controls.color} />
        <Color selectColor={selectColor} color="#0000ff" selected={controls.color} />
        <Color selectColor={selectColor} color="#00ff00" selected={controls.color} />
        <Color selectColor={selectColor} color="#ffff00" selected={controls.color} />
        <Color selectColor={selectColor} color="#00ffff" selected={controls.color} />
        <Color selectColor={selectColor} color="#ff00ff" selected={controls.color} />
        <Color selectColor={selectColor} color="#ffffff" selected={controls.color} />
      </div>
      <div className="picker">
        <Tool controls={controls} setTool={setTool} name={'Toggler'} tool={'toggler'}  />
        <Tool controls={controls} setTool={setTool} name={'Fixer'} tool={'fixer'}  />
        <Tool controls={controls} setTool={setTool} name={'Disabler'} tool={'disable'}  />
        <div className="multi-picker">
          <Tool controls={controls} setTool={setTool} name={'Dots-1'} tool={'dots-1'} image={'dots-1'} />
          <Tool controls={controls} setTool={setTool} name={'Dots-2'} tool={'dots-2'} image={'dots-2'} />
          <Tool controls={controls} setTool={setTool} name={'Dots-3'} tool={'dots-3'} image={'dots-3'} />
          <Tool controls={controls} setTool={setTool} name={'Dots-4'} tool={'dots-4'} image={'dots-4'} />
          <Tool controls={controls} setTool={setTool} name={'Dots-5'} tool={'dots-5'} image={'dots-5'} />
          <Tool controls={controls} setTool={setTool} name={'Dots-6'} tool={'dots-6'} image={'dots-6'} />
          <Tool controls={controls} setTool={setTool} name={'Dots-7'} tool={'dots-7'} image={'dots-7'} />
          <Tool controls={controls} setTool={setTool} name={'Dots-8'} tool={'dots-8'} image={'dots-8'} />
          <Tool controls={controls} setTool={setTool} name={'Dots-9'} tool={'dots-9'} image={'dots-9'} />
        </div>
        <div className="multi-picker">
          <Tool controls={controls} setTool={setTool} name={'Undots-1'} tool={'undots-1'} image={'undots-1'} />
          <Tool controls={controls} setTool={setTool} name={'Undots-2'} tool={'undots-2'} image={'undots-2'} />
          <Tool controls={controls} setTool={setTool} name={'Undots-3'} tool={'undots-3'} image={'undots-3'} />
          <Tool controls={controls} setTool={setTool} name={'Undots-4'} tool={'undots-4'} image={'undots-4'} />
          <Tool controls={controls} setTool={setTool} name={'Undots-5'} tool={'undots-5'} image={'undots-5'} />
          <Tool controls={controls} setTool={setTool} name={'Undots-6'} tool={'undots-6'} image={'undots-6'} />
          <Tool controls={controls} setTool={setTool} name={'Undots-7'} tool={'undots-7'} image={'undots-7'} />
          <Tool controls={controls} setTool={setTool} name={'Undots-8'} tool={'undots-8'} image={'undots-8'} />
          <Tool controls={controls} setTool={setTool} name={'Undots-9'} tool={'undots-9'} image={'undots-9'} />
        </div>
        <Tool controls={controls} setTool={setTool} name={'Diamond'} tool={'diamond'} image={'diamond'} />
        <Tool controls={controls} setTool={setTool} name={'Line'} tool={'line'} image={'line'} />
        <Tool controls={controls} setTool={setTool} name={'Line-rot'} tool={'line-rot'} image={'line-rot'} />
        <div className="multi-picker">
          <Tool controls={controls} setTool={setTool} name={'Mill-0'} tool={'mill-0'} image={'mill-0'} />
          <div></div>
          <Tool controls={controls} setTool={setTool} name={'Mill-1'} tool={'mill-1'} image={'mill-1'} />
          <div></div>
          <Tool controls={controls} setTool={setTool} name={'Mill-2'} tool={'mill-2'} image={'mill-2'} />
          <div></div>
          <Tool controls={controls} setTool={setTool} name={'Mill-3'} tool={'mill-3'} image={'mill-3'} />
          <div></div>
          <Tool controls={controls} setTool={setTool} name={'Mill-4'} tool={'mill-4'} image={'mill-4'} />
          <div></div>
        </div>
      </div>
    </div>
  );
}

export default Tools;
