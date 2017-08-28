///<reference path="./row.ts" />
///<reference path="./column.ts" />
///<reference path="./cell.ts" />
///<reference path="./mocks.ts" />
///<reference path="./vert-scroller.ts" />
///<reference path="./horz-scroller.ts" />
///<reference path="./sheet-selection.ts" />
///<reference path="../tool-bar/action-reducer.ts" />

class Sheet {
  static instances = 0;

  canvas: HTMLCanvasElement;
  availHeight: number = 0;
  availWidth: number = 0;  
  renderedHeight: number = 0;
  renderedWidth: number = 0;
  
  scrolledRows: number = 0;
  scrolledCols: number = 0;

  rows: Array<Row> = [];
  cols: Array<Column> = [];
  cells: Array<Array<Cell>> = [];

  firstRow: Row;
  lastRow: Row;
  firstColumn: Column;
  lastColumn: Column;

  selection: SheetSelection = new SheetSelection(this);
  actionReducer: ActionReducer = new ActionReducer(this);  

  private ctx: CanvasRenderingContext2D;
  private vertScroller: VertScroller;
  private horzScroller: HorzScroller;  

  constructor() {
    Sheet.instances++;
    this.vertScroller = new VertScroller(this);
    this.horzScroller = new HorzScroller(this);
  }

  async init() {
    await this.getData()
    this.canvas = document.getElementById('appCanvas') as HTMLCanvasElement;    
    this.canvas.width = screen.availWidth;    
    this.canvas.height = window.innerHeight - this.canvas.offsetTop - 6;

    this.availHeight = this.canvas.height;
    this.availWidth = this.canvas.width;

    this.ctx = this.canvas.getContext('2d');

    this.vertScroller.init();
    this.horzScroller.init();
    this.selection.init();

    let cr = document.getElementById("columnResizer");
    let rr = document.getElementById("rowResizer");
    cr.style.height = this.availHeight + "px";
    rr.style.width = this.availWidth + "px";

    this.render();    
    this.setHandlers();
  }

  private getData(): Promise<void> {    
    return new Promise<void>((resolve, reject) => {
      this.rows = ROWS;
      this.cols = COLS;
      this.cells = CELLS;
      for(let row of CELLS) {
        for(let cell of row) {
          cell.sheet = this;
        }
      }
      resolve();
    });
  }

  render(): void {    
    //requestAnimationFrame(()=>{
      console.time('render');
      this.firstRow = this.rows[this.scrolledRows + 1];
      this.firstColumn = this.cols[this.scrolledCols + 1];

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);       
      let curHeight = 0;
      let curWidth = 0;

      let x = 0;
      let y = 0;                
      
      for (let i in this.rows) {
        let row = this.rows[i];        
        let rowIndex = Number(i);
        if (rowIndex != 0 && rowIndex < this.scrolledRows) {
          continue;
        }

        row.y = y;
        if (curHeight >= this.availHeight) {
          this.lastRow = this.rows[rowIndex - 1];
          break;
        }

        for (let j in this.cols) {
          let colIndex = Number(j);
          if (colIndex != 0 && colIndex < this.scrolledCols) {
            continue;
          }
          let col = this.cols[j];
          col.x = x;
          if (curWidth >= this.availWidth) {
            this.lastColumn = this.cols[colIndex];
            break;
          }                                       
          this.cells[i][j].render(x, y, this.ctx);
                           
          x += col.width;
          this.renderedWidth = x;   
          curWidth += col.width;
        }
        
        x = 0;
        y += row.height; 
        curWidth = 0;             
        curHeight += row.height;
      }

      this.selection.render();
      console.timeEnd('render');
    //});    
  }

  private setHandlers() {
    this.canvas.onwheel = e => {
      this.onWheel(e);
      return false;
    }
    this.canvas.onmousemove = (e: MouseEvent) => {
      this.onMouseMove(e);
      return false;
    }
    this.canvas.onmousedown = e => {
      this.onMouseDown(e);
      return false;
    }
    this.canvas.onmouseup = e => {
      this.onMouseUp(e);
      return false;
    }
  }

  onWheel(e: WheelEvent) {
    if (e.deltaY > 0) {
      this.scrollDown();
    } else {
      this.scrollUp();
    }
    this.render();
  }

  private onMouseMove(e: MouseEvent) {
    if(!global.capturedElement) {
      let listener = this.getGlobalEventListener(e);
      if(global.hoveredElement !== listener) {
        global.hoveredElement && global.hoveredElement.onMouseOut(this);
        global.hoveredElement = listener;
        listener && listener.onMouseOver(this);
        this.render();
      }    
    }
  }

  onMouseDown(e: MouseEvent) {    
    if(global.hoveredElement) {
      global.capturedElement = global.hoveredElement;
      global.hoveredElement.onMouseDown(e);
    }
    else {
      
      let cell = this.getCellByMouseEvent(e);
      if (cell instanceof RowCell) {

      } else if (cell instanceof ColumnCell) {

      } else if (cell) {
        this.selection.select([cell]);
        this.selection.render();
        global.capturedElement = this.selection;
        this.selection.onMouseDown(e);
      }      
    }
  }

  private onMouseUp(e: MouseEvent) {    
    this.selection.input.hide();
    if (global.capturedElement instanceof SheetSelection) {
      
    } else if (global.capturedElement && global.capturedElement.onMouseUp) {
      global.capturedElement.onMouseUp(this);
    }
  }

  private getCellByMouseEvent(e: MouseEvent): Cell {
    let cell: Cell = null;
    let x = e.clientX;
    let y = e.clientY - this.canvas.offsetTop;

    let col = this.cols.filter(item => {
      if(item.number < this.scrolledCols) {
        return false;
      }
      return x >= item.x && x <= item.x + item.width;
    })[0];

    let row = this.rows.filter(item => {
      if(item.number < this.scrolledRows) {
        return false;
      }
      return y >= item.y && y <= item.y + item.height;
    })[0];

    if(col && row) {
      cell = this.cells[row.number][col.number];
    }
    return cell;
  }

  private getGlobalEventListener(e: MouseEvent) {
    let x = e.clientX;
    let y = e.clientY - this.canvas.offsetTop;
    return global.hoverListeners.filter((item) => {      
      let onX = x >= item.x && x <= item.x + item.width;
      let onY = y >= item.y && y <= item.y + item.height;      
      return onX && onY;
    })[0];
  }

  scrollUp() {
    if (this.scrolledRows == 0) {
      return;
    }
    this.scrolledRows--;
    this.render();
  }

  scrollDown() {
    this.scrolledRows++;
    this.render();
  }

  scrollRight() {    
    this.scrolledCols++;
    this.render();
  }

  scrollLeft() {
    if (this.scrolledCols == 0) {
      return;
    }
    this.scrolledCols--;
    this.render();
  }
}