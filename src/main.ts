///<reference path="./sheet/sheet.ts" />
///<reference path="./tool-bar/tool-bar.ts" />
///<reference path="./global/global.ts" />

function main() {

  document.body.onmousemove = e => {
    if (global.capturedElement && global.capturedElement.onMouseMove) {
        global.capturedElement.onMouseMove(e);
    }        
  };

  document.body.onmouseup = e => {
    if (global.capturedElement) {
      if(global.capturedElement instanceof SheetSelection) {
        global.capturedElement.onMouseUp(e);
      }      
      global.capturedElement = null;
    } else {
      
    }
  };

  let sheet = new Sheet();
  let toolBar = new ToolBar(sheet.actionReducer);  

  toolBar.init();
  sheet.init();
}
