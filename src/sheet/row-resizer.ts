///<reference path="../global/global.ts" />

class RowResizer {
  height = 4;
  width = 0;
  private _x: number;
  private _y: number;

  get x(): number {
    return this._x;
  }
  get y(): number {
    return this._y;
  }
  
  private originY = 0;
  private yDiff = 0;
  constructor(private cell: RowCell) {
    global.hoverListeners.push(this);
  }

  update(x: number, y: number) {    
    this.width = this.cell.column.width;
    this._x = x;
    this._y = y + this.cell.row.height - this.height   
  }

  render(ctx: CanvasRenderingContext2D) {
    if (global.hoveredElement !== this) {
      return;
    }

    ctx.fillStyle = "#00F";
    ctx.fillRect(this.x, this.y, this.x + this.cell.column.width, this.y + this.height);
  }

  onMouseOver(sheet: Sheet) {
    sheet.canvas.style.cursor = "ns-resize";
  }

  onMouseOut(sheet: Sheet) {
    sheet.canvas.style.cursor = "default";
  }

  onMouseMove(e: MouseEvent) {
    this.yDiff = e.clientY - this.originY;
    let rr = document.getElementById("rowResizer");
    rr.style.top = e.clientY + "px";    
  }

  onMouseDown(e: MouseEvent) {
    this.originY = e.clientY;
    let rr = document.getElementById("rowResizer");
    rr.style.top = this.y + this.height + this.cell.sheet.canvas.offsetTop + "px";
    rr.style.left = this.x + this.width + "px";
    rr.style.display = "block";
  }

  onMouseUp(sheet: Sheet) {
    document.getElementById("rowResizer").style.display = "none";
    this.cell.row.height += this.yDiff;
    sheet.render();
  }
}