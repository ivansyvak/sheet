///<reference path="../global/global.ts" />

class HorzScroller {
  private xPosition = 0;
  private originOffset = 0;
  private scroller: HTMLDivElement;

  constructor(private sheet: Sheet) {
    
  }

  init(): void {
    let c = document.createElement('div');
    c.setAttribute('class', 'scroller-container horz-sccroller-container');            
    c.style.width = this.sheet.canvas.width - 40 + "px";
    c.style.left = this.sheet.canvas.offsetLeft + 40 + "px";
    c.style.top = this.sheet.canvas.offsetTop + this.sheet.availHeight - 10 + "px";

    let s = document.createElement('div');
    this.scroller = s;
    s.setAttribute('class', 'scroller horz-scroller');
    s.onmousedown = e => this.onMouseDown(e);    

    let totalWidth = this.sheet.cols
      .map(item => item.width)
      .reduce((prev, cur) => prev + cur);

    let koef = this.sheet.availWidth / totalWidth;
    if(koef > 1) {
      koef = 1;
    }

    s.style.left = "0px";
    s.style.width = this.sheet.availWidth * koef + "px";
    document.getElementById("appContainer").appendChild(c);
    c.appendChild(s);
  }

  private onMouseDown(e: MouseEvent) {
    this.xPosition = e.clientX;
    this.originOffset = this.scroller.offsetLeft;
    global.capturedElement = this;    
  }

  onMouseMove(e: MouseEvent) {
    let xDiff = e.clientX - this.xPosition;
    let curLeft = this.originOffset + xDiff;
    if (curLeft < 0) {
      curLeft = 0;
    } else if (curLeft > this.sheet.availWidth - this.scroller.clientWidth) {
      curLeft = this.sheet.availWidth - this.scroller.clientWidth;
    }
    this.scroller.style.left = curLeft + "px";
    let diff = this.sheet.renderedWidth - this.sheet.availWidth;
    let scrolled = xDiff / diff;
    if (xDiff > 0) {
      scrolled > this.sheet.scrolledCols && this.sheet.scrollRight();
    } else if (xDiff < 0) {
      this.sheet.scrollLeft();
    }    
  }
}
