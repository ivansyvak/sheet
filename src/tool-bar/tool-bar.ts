///<reference path="./actions.mock.ts"/>
///<reference path="./action-reducer.ts" />

class ToolBar {

  private container:HTMLDivElement;

  constructor(private reducer: ActionReducer) {

  }

  init(): void {
    this.container = document.getElementById("appToolBar") as HTMLDivElement;
    for(let action of ACTIONS) {
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
