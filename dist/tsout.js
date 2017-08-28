var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Cell {
    constructor(row, column) {
        this.row = row;
        this.column = column;
        this._borderColorTop = global.defaultBorderColor;
        this._borderColorRight = global.defaultBorderColor;
        this._borderColorBottom = global.defaultBorderColor;
        this._borderColorLeft = global.defaultBorderColor;
        this.sheet = null;
        this.value = "";
        this.borderWidth = 0.5;
        this.fontColor = "#000";
        this.backgroundColor = "#FFF";
    }
    get borderColorTop() { return this._borderColorTop; }
    set borderColorTop(value) {
        this._borderColorTop = value;
    }
    get borderColorRight() { return this._borderColorRight; }
    set borderColorRight(value) {
        this._borderColorRight = value;
        let rightCell = this.sheet.cells[this.row.number][this.column.number + 1];
        if (rightCell) {
            rightCell.borderColorLeft = value;
        }
    }
    get borderColorBottom() { return this._borderColorBottom; }
    set borderColorBottom(value) {
        this._borderColorBottom = value;
        let botCell = this.sheet.cells[this.row.number + 1][this.column.number];
        if (botCell) {
            botCell.borderColorTop = value;
        }
    }
    get borderColorLeft() { return this._borderColorLeft; }
    set borderColorLeft(value) {
        this._borderColorLeft = value;
    }
    render(x1, y1, ctx) {
        let x2 = x1 + this.column.width;
        let y2 = y1 + this.row.height;
        this.renderBackground(x1, y1, x2, y2, ctx);
        this.renderValue(x1, y1, x2, y2, ctx);
        this.renderBorder(x1, y1, x2, y2, ctx);
    }
    borderColor(value) {
        this.borderColorTop = value;
        this.borderColorRight = value;
        this.borderColorBottom = value;
        this.borderColorLeft = value;
    }
    renderBorder(x1, y1, x2, y2, ctx) {
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
        }
        else {
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
    renderValue(x1, y1, x2, y2, ctx) {
        ctx.fillStyle = this.fontColor;
        ctx.fillText(this.value, x1, y1 + (y2 - y1) / 2);
    }
    renderBackground(x1, y1, x2, y2, ctx) {
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(x1, y1, x2, y2);
    }
}
let global = {
    capturedElement: null,
    hoveredElement: null,
    hoverListeners: [],
    borderColor: "#000",
    defaultBorderColor: "#AAA"
};
///<reference path="../global/global.ts" />
class ColumnResizer {
    constructor(cell) {
        this.cell = cell;
        this.height = 0;
        this.width = 4;
        this.originX = 0;
        this.xDiff = 0;
        global.hoverListeners.push(this);
    }
    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
    update(x, y) {
        this.height = this.cell.row.height;
        this._x = x + this.cell.column.width - this.width;
        this._y = y;
    }
    render(ctx) {
        if (global.hoveredElement !== this) {
            return;
        }
        ctx.fillStyle = "#00F";
        ctx.fillRect(this.x, this.y, this.x + this.width, this.y + this.cell.row.height);
    }
    onMouseOver(sheet) {
        sheet.canvas.style.cursor = "ew-resize";
    }
    onMouseOut(sheet) {
        sheet.canvas.style.cursor = "default";
    }
    onMouseMove(e) {
        this.xDiff = e.clientX - this.originX;
        document.getElementById("columnResizer").style.left = e.clientX + "px";
    }
    onMouseDown(e) {
        this.originX = e.clientX;
        let cr = document.getElementById("columnResizer");
        cr.style.top = this.y + this.cell.sheet.canvas.offsetTop + this.height + "px";
        cr.style.left = this.x + this.width + "px";
        cr.style.display = "block";
    }
    onMouseUp(sheet) {
        document.getElementById("columnResizer").style.display = "none";
        this.cell.column.width += this.xDiff;
        sheet.render();
    }
}
///<reference path="./column-resizer.ts" />
class ColumnCell extends Cell {
    constructor() {
        super(...arguments);
        this.resizer = new ColumnResizer(this);
    }
    render(x1, y1, ctx) {
        super.render(x1, y1, ctx);
        this.resizer.update(x1, y1);
        this.resizer.render(ctx);
    }
}
///<reference path="../global/global.ts" />
class RowResizer {
    constructor(cell) {
        this.cell = cell;
        this.height = 4;
        this.width = 0;
        this.originY = 0;
        this.yDiff = 0;
        global.hoverListeners.push(this);
    }
    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
    update(x, y) {
        this.width = this.cell.column.width;
        this._x = x;
        this._y = y + this.cell.row.height - this.height;
    }
    render(ctx) {
        if (global.hoveredElement !== this) {
            return;
        }
        ctx.fillStyle = "#00F";
        ctx.fillRect(this.x, this.y, this.x + this.cell.column.width, this.y + this.height);
    }
    onMouseOver(sheet) {
        sheet.canvas.style.cursor = "ns-resize";
    }
    onMouseOut(sheet) {
        sheet.canvas.style.cursor = "default";
    }
    onMouseMove(e) {
        this.yDiff = e.clientY - this.originY;
        let rr = document.getElementById("rowResizer");
        rr.style.top = e.clientY + "px";
    }
    onMouseDown(e) {
        this.originY = e.clientY;
        let rr = document.getElementById("rowResizer");
        rr.style.top = this.y + this.height + this.cell.sheet.canvas.offsetTop + "px";
        rr.style.left = this.x + this.width + "px";
        rr.style.display = "block";
    }
    onMouseUp(sheet) {
        document.getElementById("rowResizer").style.display = "none";
        this.cell.row.height += this.yDiff;
        sheet.render();
    }
}
///<reference path="./row-resizer.ts" />
class RowCell extends Cell {
    constructor() {
        super(...arguments);
        this.resizer = new RowResizer(this);
    }
    render(x1, y1, ctx) {
        super.render(x1, y1, ctx);
        this.resizer.update(x1, y1);
        this.resizer.render(ctx);
    }
}
///<reference path="./column-cell.ts" />
///<reference path="./row-cell.ts" />
let ROWS = [];
for (let i = 0; i < 1000; i++) {
    ROWS.push({
        number: i,
        height: 20,
        y: 0
    });
}
let chars = "_ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let COLS = [];
let index = 0;
for (let char of chars) {
    COLS.push({
        number: index++,
        x: 0,
        char: char,
        width: char == "_" ? 40 : 100
    });
}
let CELLS = [];
for (let row of ROWS) {
    let colsArr = [];
    for (let col of COLS) {
        let cell = new Cell(row, col);
        if (col.char == "_") {
            if (row.number == 0) {
                cell.value = "";
            }
            else {
                cell = new RowCell(row, col);
                cell.value = row.number.toString();
            }
            cell.backgroundColor = "#EEE";
        }
        else if (row.number == 0) {
            cell = new ColumnCell(row, col);
            cell.backgroundColor = "#EEE";
            cell.value = col.char;
        }
        colsArr.push(cell);
    }
    CELLS.push(colsArr);
}
class VertScroller {
    constructor(sheet) {
        this.sheet = sheet;
    }
    init() {
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
        if (koef > 1) {
            koef = 1;
        }
        s.style.height = this.sheet.availHeight * koef + "px";
        c.appendChild(s);
    }
}
///<reference path="../global/global.ts" />
class HorzScroller {
    constructor(sheet) {
        this.sheet = sheet;
        this.xPosition = 0;
        this.originOffset = 0;
    }
    init() {
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
        if (koef > 1) {
            koef = 1;
        }
        s.style.left = "0px";
        s.style.width = this.sheet.availWidth * koef + "px";
        document.getElementById("appContainer").appendChild(c);
        c.appendChild(s);
    }
    onMouseDown(e) {
        this.xPosition = e.clientX;
        this.originOffset = this.scroller.offsetLeft;
        global.capturedElement = this;
    }
    onMouseMove(e) {
        let xDiff = e.clientX - this.xPosition;
        let curLeft = this.originOffset + xDiff;
        if (curLeft < 0) {
            curLeft = 0;
        }
        else if (curLeft > this.sheet.availWidth - this.scroller.clientWidth) {
            curLeft = this.sheet.availWidth - this.scroller.clientWidth;
        }
        this.scroller.style.left = curLeft + "px";
        let diff = this.sheet.renderedWidth - this.sheet.availWidth;
        let scrolled = xDiff / diff;
        if (xDiff > 0) {
            scrolled > this.sheet.scrolledCols && this.sheet.scrollRight();
        }
        else if (xDiff < 0) {
            this.sheet.scrollLeft();
        }
    }
}
///<reference path="./sheet-selection.ts" />
///<reference path="./sheet.ts" />
class SheetInput {
    constructor(selection, sheet) {
        this.selection = selection;
        this.sheet = sheet;
    }
    init() {
        this.htmlElement = document.createElement('input');
        this.htmlElement.setAttribute('class', 'sheet-input');
        this.htmlElement.style.opacity = "0";
        this.selection.getDiv().appendChild(this.htmlElement);
        this.htmlElement.onchange = e => {
            this.selection.cells[0].value = this.htmlElement.value;
            this.hide();
            this.sheet.render();
        };
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
///<reference path="./sheet-input.ts" />
class SheetSelection {
    constructor(sheet) {
        this.sheet = sheet;
        this.originX = 0;
        this.originY = 0;
        this.cells = [];
        this.cols = [];
        this.rows = [];
        this.input = new SheetInput(this, this.sheet);
    }
    init() {
        this.div = document.createElement('div');
        this.div.setAttribute('class', 'sheet-selection');
        this.div.onwheel = e => this.sheet.onWheel(e);
        this.div.onmousedown = e => this.sheet.onMouseDown(e);
        this.div.ondblclick = e => this.onDoubleClick(e);
        document.getElementById('appContainer').appendChild(this.div);
        this.input.init();
    }
    select(cells) {
        this.rows = [];
        this.cols = [];
        this.cells = cells;
        for (let cell of cells) {
            if (this.rows.indexOf(cell.row) < 0) {
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
        if (scrolled) {
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
    onMouseDown(e) {
        this.input.hide();
        let x = 100000;
        let y = 100000;
        if (this.cells.length == 0) {
            x = 0;
            y = 0;
        }
        for (let cell of this.cells) {
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
    onMouseUp(e) {
    }
    onMouseMove(e) {
        let x = e.clientX;
        let y = e.clientY - this.sheet.canvas.offsetTop;
        let reverseX = false;
        let reverseY = false;
        let x1, x2, y1, y2;
        if (x < this.originX) {
            x1 = x;
            x2 = this.originX;
            reverseX = true;
        }
        else {
            x1 = this.originX;
            x2 = x;
        }
        if (y < this.originY) {
            y1 = y;
            y2 = this.originY;
            reverseY = true;
        }
        else {
            y1 = this.originY;
            y2 = y;
        }
        let cols = [];
        for (let col of this.sheet.cols) {
            if (col.number < this.sheet.scrolledCols) {
                continue;
            }
            let colX = col.x;
            if (reverseX) {
                colX += col.width;
            }
            if (colX >= x1 && col.x <= x2) {
                cols.push(col);
            }
        }
        let rows = [];
        for (let row of this.sheet.rows) {
            if (row.number < this.sheet.scrolledRows) {
                continue;
            }
            let rowY = row.y;
            if (reverseY) {
                rowY += row.height;
            }
            if (rowY >= y1 && row.y <= y2) {
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
    onDoubleClick(e) {
        this.input.show();
        return false;
    }
    getDiv() {
        return this.div;
    }
}
///<reference path="../sheet/sheet.ts" />
///<reference path="./action.ts" />
///<reference path="../global/global.ts" />
class ActionReducer {
    constructor(sheet) {
        this.sheet = sheet;
    }
    reduce(action) {
        switch (action.name) {
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
///<reference path="./row.ts" />
///<reference path="./column.ts" />
///<reference path="./cell.ts" />
///<reference path="./mocks.ts" />
///<reference path="./vert-scroller.ts" />
///<reference path="./horz-scroller.ts" />
///<reference path="./sheet-selection.ts" />
///<reference path="../tool-bar/action-reducer.ts" />
class Sheet {
    constructor() {
        this.availHeight = 0;
        this.availWidth = 0;
        this.renderedHeight = 0;
        this.renderedWidth = 0;
        this.scrolledRows = 0;
        this.scrolledCols = 0;
        this.rows = [];
        this.cols = [];
        this.cells = [];
        this.selection = new SheetSelection(this);
        this.actionReducer = new ActionReducer(this);
        Sheet.instances++;
        this.vertScroller = new VertScroller(this);
        this.horzScroller = new HorzScroller(this);
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getData();
            this.canvas = document.getElementById('appCanvas');
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
        });
    }
    getData() {
        return new Promise((resolve, reject) => {
            this.rows = ROWS;
            this.cols = COLS;
            this.cells = CELLS;
            for (let row of CELLS) {
                for (let cell of row) {
                    cell.sheet = this;
                }
            }
            resolve();
        });
    }
    render() {
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
    setHandlers() {
        this.canvas.onwheel = e => {
            this.onWheel(e);
            return false;
        };
        this.canvas.onmousemove = (e) => {
            this.onMouseMove(e);
            return false;
        };
        this.canvas.onmousedown = e => {
            this.onMouseDown(e);
            return false;
        };
        this.canvas.onmouseup = e => {
            this.onMouseUp(e);
            return false;
        };
    }
    onWheel(e) {
        if (e.deltaY > 0) {
            this.scrollDown();
        }
        else {
            this.scrollUp();
        }
        this.render();
    }
    onMouseMove(e) {
        if (!global.capturedElement) {
            let listener = this.getGlobalEventListener(e);
            if (global.hoveredElement !== listener) {
                global.hoveredElement && global.hoveredElement.onMouseOut(this);
                global.hoveredElement = listener;
                listener && listener.onMouseOver(this);
                this.render();
            }
        }
    }
    onMouseDown(e) {
        if (global.hoveredElement) {
            global.capturedElement = global.hoveredElement;
            global.hoveredElement.onMouseDown(e);
        }
        else {
            let cell = this.getCellByMouseEvent(e);
            if (cell instanceof RowCell) {
            }
            else if (cell instanceof ColumnCell) {
            }
            else if (cell) {
                this.selection.select([cell]);
                this.selection.render();
                global.capturedElement = this.selection;
                this.selection.onMouseDown(e);
            }
        }
    }
    onMouseUp(e) {
        this.selection.input.hide();
        if (global.capturedElement instanceof SheetSelection) {
        }
        else if (global.capturedElement && global.capturedElement.onMouseUp) {
            global.capturedElement.onMouseUp(this);
        }
    }
    getCellByMouseEvent(e) {
        let cell = null;
        let x = e.clientX;
        let y = e.clientY - this.canvas.offsetTop;
        let col = this.cols.filter(item => {
            if (item.number < this.scrolledCols) {
                return false;
            }
            return x >= item.x && x <= item.x + item.width;
        })[0];
        let row = this.rows.filter(item => {
            if (item.number < this.scrolledRows) {
                return false;
            }
            return y >= item.y && y <= item.y + item.height;
        })[0];
        if (col && row) {
            cell = this.cells[row.number][col.number];
        }
        return cell;
    }
    getGlobalEventListener(e) {
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
Sheet.instances = 0;
///<reference path="./action.ts"/>
const ACTIONS = [
    //font
    {
        name: "align-left",
        icon: "format_align_left"
    },
    {
        name: "align-center",
        icon: "format_align_center"
    },
    {
        name: "align-left",
        icon: "format_align_right"
    },
    {
        name: "text-color",
        icon: "format_color_text"
    },
    {
        name: "text-background",
        icon: "format_color_fill"
    },
    {
        name: "border-color",
        icon: "border_color"
    },
    //border
    {
        name: "border-all",
        icon: "border_all"
    },
    {
        name: "border-outer",
        icon: "border_outer"
    },
    {
        name: "border-inner",
        icon: "border_inner"
    },
    {
        name: "border-horizontal",
        icon: "border_horizontal"
    },
    {
        name: "border-vertical",
        icon: "border_vertical"
    },
    {
        name: "border-top",
        icon: "border_top"
    },
    {
        name: "border-right",
        icon: "border_right"
    },
    {
        name: "border-bottom",
        icon: "border_bottom"
    },
    {
        name: "border-left",
        icon: "border_left"
    },
    {
        name: "border-clear",
        icon: "border_clear"
    },
    //cells
    {
        name: "merge-cells",
        icon: "compare_arrows"
    }
];
///<reference path="./actions.mock.ts"/>
///<reference path="./action-reducer.ts" />
class ToolBar {
    constructor(reducer) {
        this.reducer = reducer;
    }
    init() {
        this.container = document.getElementById("appToolBar");
        for (let action of ACTIONS) {
            let d = document.createElement('div');
            d.onclick = e => this.reducer.reduce(action);
            let span = document.createElement('span');
            span.setAttribute('class', `material-icons`);
            span.textContent = action.icon;
            d.appendChild(span);
            this.container.appendChild(d);
        }
    }
}
///<reference path="./sheet/sheet.ts" />
///<reference path="./tool-bar/tool-bar.ts" />
///<reference path="./global/global.ts" />
function main() {
    document.body.onmousemove = e => {
        if (global.capturedElement && global.capturedElement.onMouseMove) {
            global.capturedElement.onMouseMove(e);
        }
    };
    document.body.onmouseup = e => {
        if (global.capturedElement) {
            if (global.capturedElement instanceof SheetSelection) {
                global.capturedElement.onMouseUp(e);
            }
            global.capturedElement = null;
        }
        else {
        }
    };
    let sheet = new Sheet();
    let toolBar = new ToolBar(sheet.actionReducer);
    toolBar.init();
    sheet.init();
}
//# sourceMappingURL=tsout.js.map