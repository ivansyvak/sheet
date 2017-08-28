///<reference path="./column-cell.ts" />
///<reference path="./row-cell.ts" />

let ROWS: Row[] = [];
for (let i = 0; i < 1000; i++) {
  ROWS.push({
    number: i,
    height: 20,
    y: 0
  });
}

let chars = "_ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let COLS: Column[] = [];
let index = 0;
for (let char of chars) {
  COLS.push({
    number: index++,
    x: 0,
    char: char,
    width: char == "_" ? 40 : 100
  });
}

let CELLS: Array<Array<Cell>> = [];
for (let row of ROWS) {
  let colsArr = [];
  for (let col of COLS) {
    let cell = new Cell(row, col);
    if(col.char == "_") {      
      if(row.number == 0 ) {
        cell.value = "";
      } else {
        cell = new RowCell(row, col);
        cell.value = row.number.toString();
      }
      cell.backgroundColor = "#EEE";
    } else if (row.number == 0) {
      cell = new ColumnCell(row, col);
      cell.backgroundColor = "#EEE";
      cell.value = col.char;
    }
    colsArr.push(cell);
  }
  CELLS.push(colsArr);
}
