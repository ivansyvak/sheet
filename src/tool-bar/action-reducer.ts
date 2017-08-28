///<reference path="../sheet/sheet.ts" />
///<reference path="./action.ts" />
///<reference path="../global/global.ts" />

class ActionReducer {
  constructor(private sheet: Sheet) {}

  reduce(action: Action): void {
    switch(action.name) {
      case "border-all":
        this.borderAll();
        break;

      case "border-outer":
        this.borderOuter();
        break;

      case 'border-inner':
        this.borderInner();
        break;

      case 'border-horizontal':
        this.borderHorizontal();
        break;

      case 'border-vertical':
        this.borderVertical();
        break;
      
      case "border-top":
        this.borderTop();
        break; 

      case "border-right":
        this.borderRight();
        break;

      case "border-bottom":
        this.borderBottom();
        break;

      case "border-left":
        this.borderLeft();
        break;

      case "border-clear":
        this.borderClear();
        break;
      
    }
    
    this.sheet.render();
  }

  borderAll() {
    for (let cell of this.sheet.selection.cells) {
      cell.borderColor(global.borderColor);
    }    
  }

  borderOuter() {
    let selection = this.sheet.selection;    
    this.borderTop();
    this.borderRight();
    this.borderBottom();
    this.borderLeft();    
  }

  borderInner() {
    let tmp = global.borderColor;
    this.borderAll();
    global.borderColor = global.defaultBorderColor;
    this.borderOuter();
    global.borderColor = tmp;
  }

  borderHorizontal() {
    this.sheet.selection.cells.forEach(cell => {
      cell.borderColorTop = global.borderColor;
      cell.borderColorBottom = global.borderColor;
    });
  }

  borderVertical() {
    this.sheet.selection.cells.forEach(cell => {
      cell.borderColorLeft = global.borderColor;
      cell.borderColorRight = global.borderColor;
    });
  }

  borderTop() {
    this.sheet.selection.cells
    .filter(item => item.row === this.sheet.selection.rows[0])
    .forEach(item => item.borderColorTop = global.borderColor);    
  }

  borderRight() {
    this.sheet.selection.cells
    .filter(item => item.column === this.sheet.selection.cols[this.sheet.selection.cols.length - 1])
    .forEach(item => item.borderColorRight = global.borderColor);
  }

  borderBottom() {
    this.sheet.selection.cells
    .filter(item => item.row === this.sheet.selection.rows[this.sheet.selection.rows.length - 1])
    .forEach(item => item.borderColorBottom = global.borderColor);
  }

  borderLeft() {
    this.sheet.selection.cells
    .filter(item => item.column === this.sheet.selection.cols[0])
    .forEach(item => item.borderColorLeft = global.borderColor);    
  }

  borderClear() {
    let tmp = global.borderColor;
    global.borderColor = global.defaultBorderColor;
    this.borderAll();
    global.borderColor = tmp;
  }
}