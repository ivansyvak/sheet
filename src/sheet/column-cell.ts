///<reference path="./column-resizer.ts" />

class ColumnCell extends Cell {
  private resizer: ColumnResizer = new ColumnResizer(this);

  render(x1: number, y1: number, ctx: CanvasRenderingContext2D) {
    super.render(x1, y1, ctx);
    this.resizer.update(x1, y1);
    this.resizer.render(ctx);
  }
}