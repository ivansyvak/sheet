///<reference path="../global/global.ts" />

class ColumnResizer {
  height = 0;
  width = 4;
  private _x: number;
  private _y: number;

  get x(): number {
    return this._x;
  }
  get y(): number {
    return this._y;
  }
  
  private originX = 0;
  private xDiff = 0;
  constructor(private cell: ColumnCell) {
    global.hoverListeners.push(this);
  }

  update(x: number, y: number) {    
    this.height = this.cell.row.height;
    this._x = x + this.cell.column.width - this.width;
    this._y = y;    
  }

  render(ctx: CanvasRenderingContext2D) {
    if (global.hoveredElement !== this) {
      return;
    }
    ctx.fillStyle = "#00F";
    ctx.fillRect(this.x, this.y, this.x + this.width, this.y + this.cell.row.height);
  }

  onMouseOver(sheet: Sheet) {
    sheet.canvas.style.cursor = "ew-resize";
  }

  onMouseOut(sheet: Sheet) {
    sheet.canvas.style.cursor = "default";
  }

  onMouseMove(e: MouseEvent) {
    this.xDiff = e.clientX - this.originX;
    document.getElementById("columnResizer").style.left = e.clientX + "px";
  }

  onMouseDown(e: MouseEvent) {
    this.originX = e.clientX;
    let cr = document.getElementById("columnResizer");
    cr.style.top = this.y + this.cell.sheet.canvas.offsetTop + this.height + "px";
    cr.style.left = this.x + this.width + "px";
    cr.style.display = "block";
  }

  onMouseUp(sheet: Sheet) {
    document.getElementById("columnResizer").style.display = "none";
    this.cell.column.width += this.xDiff;
    sheet.render();
  }
}