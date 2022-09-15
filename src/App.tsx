import './App.css';
import Editor from './Editor';

function App() {
  return (
    <div className="app">
      <header className="header">
        Taiji Editor
      </header>
      <div className="editor-container">
        <Editor />
      </div>
    </div>
  );
}

export default App;
