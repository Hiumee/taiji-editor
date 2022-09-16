import './Color.css';

interface props {
  color: string
  selectColor: (color: string) => void
  selected: string
}

function Color({color, selectColor, selected}: props) {
  return (
    <div className='color-container'>
        <div style={{backgroundColor: color}} className={selected === color ? 'selected' : 'color'} onClick={() => selectColor(color)}>
        </div>
    </div>
  );
}

export default Color;
