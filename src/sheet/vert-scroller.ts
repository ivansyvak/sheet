class VertScroller {
  constructor(private sheet: Sheet) {

  }

  init(): void {
    let c = document.createElement('div');
    c.setAttribute('class', 'scroller-container vert-sccroller-container');            
    c.style.height = this.sheet.canvas.height - 20 + "px";
    c.style.top = this.sheet.canvas.offsetTop + 20 + "px";
    document.getElementById("appContainer").appendChild(c);

    let s = document.createElement('div');
    s.setAttribute('class', 'scroller vert-scroller');

    let totalHeight = this.sheet.rows
      .map(item => item.height)
      .reduce((prev, cur) => prev + cur);

    let koef = this.sheet.availHeight / totalHeight;
    if(koef > 1) {
      koef = 1;
    }

    s.style.height = this.sheet.availHeight * koef + "px";
    c.appendChild(s);
  }

}

