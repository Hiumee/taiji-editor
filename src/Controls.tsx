export interface Controls {
  mouseDown: boolean,
  activeFill: boolean,
  editMode: boolean,
  tool: string,
  width: number,
  height: number
}

function newControls(): Controls {
  return { mouseDown: false, activeFill: false, editMode: false, tool: "fixer", width: 10, height: 10 }
}

function controlsMouseUp(controls: Controls): Controls {
  return {...controls, mouseDown: false}
}

function controlsMouseDown(controls: Controls): Controls {
  return {...controls, mouseDown: true}
}

function controlsSetActiveFill(controls: Controls, fill: boolean): Controls {
  return {...controls, activeFill: fill}
}

function controlsEnableEditMode(controls: Controls): Controls {
  return {...controls, editMode: true}
}

function controlsDisableEditMode(controls: Controls): Controls {
  return {...controls, editMode: false}
}

function controlsSetTool(controls: Controls, tool: string): Controls {
  return {...controls, tool: tool}
}

function controlsSetSize(controls: Controls, width: number, height: number) {
  return {...controls, width: width, height: height}
}

export { newControls, controlsMouseUp, controlsMouseDown, controlsSetActiveFill, controlsEnableEditMode, controlsDisableEditMode, controlsSetTool, controlsSetSize };