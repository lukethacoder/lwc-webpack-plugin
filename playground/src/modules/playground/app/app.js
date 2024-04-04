import { LightningElement } from 'lwc'

export default class App extends LightningElement {
  handleClick(event) {
    console.log('event.target.label', event.target.label)
  }
}
