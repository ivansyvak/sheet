///<reference path="./sheet-selection.ts" />
///<reference path="./sheet.ts" />

class SheetInput {

  private htmlElement: HTMLInputElement;
  private selectionBorder: string;
  constructor(private selection: SheetSelection, private sheet: Sheet) {}

  init() {
    this.htmlElement = document.createElement('input');
    this.htmlElement.setAttribute('class', 'sheet-input');
    this.htmlElement.style.opacity = "0";
    this.selection.getDiv().appendChild(this.htmlElement);
    this.htmlElement.onchange = e => {
      this.selection.cells[0].value = this.htmlElement.value;
      this.hide();
      this.sheet.render();
    }
  }

  show() {
    let div = this.selection.getDiv();
    this.selectionBorder = div.style.border;
    div.style.border = "none";

    this.htmlElement.value = this.selection.cells[0].value;            
    this.htmlElement.style.width = div.style.width;
    this.htmlElement.style.height = div.style.height;
    this.htmlElement.style.opacity = "1";
  }

  hide() {
    this.selection.getDiv().style.border = this.selectionBorder;
    this.htmlElement.style.opacity = "0";
  }
}