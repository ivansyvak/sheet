class Cell {

  private _borderColorTop: string = global.defaultBorderColor;
  get borderColorTop(): string { return this._borderColorTop; }
  set borderColorTop(value: string) {
    this._borderColorTop = value;
  }

  private _borderColorRight: string = global.defaultBorderColor;
  get borderColorRight(): string { return  this._borderColorRight; }
  set borderColorRight(value: string) {
    this._borderColorRight = value;
    let rightCell: Cell = this.sheet.cells[this.row.number][this.column.number + 1];
    if(rightCell) {
      rightCell.borderColorLeft = value;
    }
  }

  private _borderColorBottom: string = global.defaultBorderColor;
  get borderColorBottom(): string { return this._borderColorBottom; }
  set borderColorBottom(value: string) {
    this._borderColorBottom = value;
    let botCell: Cell = this.sheet.cells[this.row.number + 1][this.column.number];
    if(botCell) {
      botCell.borderColorTop = value;
    }
  }

  private _borderColorLeft: string = global.defaultBorderColor;
  get borderColorLeft(): string { return this._borderColorLeft; }
  set borderColorLeft(value: string) {
    this._borderColorLeft = value;    
  }

  sheet: Sheet = null;
  value: string = "";
  borderWidth: number = 0.5;
  fontColor: string = "#000";
  backgroundColor: string = "#FFF";

  constructor (public row:Row, public column: Column) {}

  render(x1: number, y1: number, ctx: CanvasRenderingContext2D) {
    let x2 = x1 + this.column.width;
    let y2 = y1 + this.row.height
    
    this.renderBackground(x1, y1, x2, y2, ctx);
    this.renderValue(x1, y1, x2, y2, ctx);
    this.renderBorder(x1, y1, x2, y2, ctx);
    
  }

  borderColor(value: string) {
    this.borderColorTop = value;
    this.borderColorRight = value;
    this.borderColorBottom = value;
    this.borderColorLeft = value;
  }
  
  private renderBorder(
    x1: number, y1: number, x2: number, y2: number, ctx: CanvasRenderingContext2D) {
                     
      ctx.beginPath();
      ctx.lineWidth = this.borderWidth;
      ctx.strokeStyle = this.borderColorTop;
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y1);  
      ctx.stroke();  
      ctx.closePath();

      ctx.beginPath();
      ctx.strokeStyle = this.borderColorLeft;
      ctx.moveTo(x1, y1);
      ctx.lineTo(x1, y2);
      ctx.stroke();
      ctx.closePath(); 
      if (this instanceof ColumnCell || this instanceof RowCell) {

      } else {
        //debugger;
      }
      // ctx.beginPath();
      // ctx.strokeStyle = this.borderColorBottom
      // ctx.moveTo(x1, y2);
      // ctx.lineTo(x2, y2);
      // ctx.stroke();
      // ctx.closePath();

      // ctx.beginPath();
      // ctx.strokeStyle = this.borderColorLeft;
      // ctx.moveTo(x1, y1);
      // ctx.lineTo(x1, y2);
      // ctx.stroke();
      // ctx.closePath();
  }

  private renderValue(
    x1: number, y1: number, x2: number, y2: number, ctx: CanvasRenderingContext2D) {
      ctx.fillStyle = this.fontColor;
      ctx.fillText(this.value,  x1, y1 + (y2 - y1) / 2);
  }

  private renderBackground(
    x1: number, y1: number, x2: number, y2: number, ctx: CanvasRenderingContext2D) {
      ctx.fillStyle = this.backgroundColor;
      ctx.fillRect(x1, y1, x2, y2);
  }
}
