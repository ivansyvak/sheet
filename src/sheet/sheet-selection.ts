///<reference path="./sheet-input.ts" />

class SheetSelection {

  private div: HTMLDivElement;  
  private originX = 0;
  private originY = 0;

  cells: Array<Cell> = [];
  cols: Array<Column> = [];
  rows: Array<Row> = [];

  input: SheetInput;
  
  constructor(private sheet: Sheet) {
    this.input = new SheetInput(this, this.sheet);
  }

  init(): void {
    this.div = document.createElement('div');
    this.div.setAttribute('class', 'sheet-selection');
    this.div.onwheel = e => this.sheet.onWheel(e);
    this.div.onmousedown = e => this.sheet.onMouseDown(e);
    this.div.ondblclick = e => this.onDoubleClick(e);        

    document.getElementById('appContainer').appendChild(this.div);
    this.input.init();
  }

  select(cells: Cell[]) {
    this.rows = [];
    this.cols = [];
    this.cells = cells;
    for (let cell of cells) {
      if (this.rows.indexOf(cell.row) < 0 ) {
        this.rows.push(cell.row);
      }
      if (this.cols.indexOf(cell.column) < 0) {
        this.cols.push(cell.column);
      }      
    }

    this.rows.sort((a, b) => {
      return a.number < b.number ? -1 : 1;
    });
    this.cols.sort((a, b) => {
      return a.number < b.number ? -1 : 1;
    });    
  }

  render() {
    if (this.cells.length == 0) {
      this.div.style.display = "none";
      return;
    }

    let scrolled = this.cells.filter(item => {
      return item.row.number < this.sheet.scrolledRows
        || item.column.number < this.sheet.scrolledCols;
    }).length > 0;

    if(scrolled) {
      this.div.style.display = "none";
      return;
    }

    let x = 10000000;
    let y = 10000000;
    let h = 0;
    let w = 0;

    h = this.sheet.rows
      .filter(item => this.cells.filter(c => c.row === item).length)
      .map(item => item.height)
      .reduce((prev, cur) => prev + cur);

    w = this.sheet.cols
      .filter(item => this.cells.filter(cell => cell.column === item).length)
      .map(item => item.width)
      .reduce((prev, cur) => prev + cur);


    for (let cell of this.cells) {
      if (cell.column.x < x) {
        x = cell.column.x;
      }
      if (cell.row.y < y) {
        y = cell.row.y;
      }      
    }    

    y += this.sheet.canvas.offsetTop;

    this.div.style.left = x + "px";
    this.div.style.top = y + "px";
    this.div.style.width = w + "px";
    this.div.style.height = h + "px";
    this.div.style.display = "block";
  }

  onMouseDown(e: MouseEvent) {
    this.input.hide();
    let x = 100000;
    let y = 100000;
    if(this.cells.length == 0) {
      x = 0;
      y = 0;
    }
    for(let cell of this.cells) {
      if (cell.column.x < x) {
        x = cell.column.x;
      }
      if (cell.row.y < y) {
        y = cell.row.y;
      }
    }
    this.originX = x;
    this.originY = y;    
  }

  onMouseUp(e: MouseEvent) {     
  }

  onMouseMove(e: MouseEvent) {
    let x = e.clientX;
    let y = e.clientY - this.sheet.canvas.offsetTop;

    let reverseX = false;
    let reverseY = false;

    let x1, x2, y1, y2;
    if (x < this.originX) {
      x1 = x;
      x2 = this.originX;
      reverseX = true;
    } else {
      x1 = this.originX;
      x2 = x;
    }
    if (y < this.originY) {
      y1 = y;
      y2 = this.originY;
      reverseY = true;
    } else {
      y1 = this.originY;
      y2 = y;
    }

    let cols = [];
    for(let col of this.sheet.cols) {
      if (col.number < this.sheet.scrolledCols) {
        continue;
      }
      
      let colX = col.x;
      if(reverseX) {
        colX += col.width;
      }
      if(colX >= x1 && col.x <= x2) {
        cols.push(col);
      }
    }
    
    let rows = [];
    for(let row of this.sheet.rows) {
      if (row.number < this.sheet.scrolledRows) {
        continue;
      }
      let rowY = row.y;
      if(reverseY) {
        rowY += row.height;
      }
      if(rowY >= y1 && row.y <= y2) {
        rows.push(row);
      }
    }    

    let cells = [];
    for (let row of rows) {
      for (let col of cols) {
        let cell = this.sheet.cells[row.number][col.number];
        if (cell instanceof RowCell || cell instanceof ColumnCell) {
          continue;
        }
        cells.push(cell);
      }
    }
    
    this.select(cells);
    this.render();
  }

  onDoubleClick(e: MouseEvent) {
    this.input.show();
    return false;
  }
  getDiv(): HTMLDivElement  {
    return this.div;
  }
}