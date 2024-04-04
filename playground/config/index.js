import '@lwc/synthetic-shadow'

import { createElement } from 'lwc'
import App from 'playground/app'

document
  .getElementById('main')
  .appendChild(createElement('playground-app', { is: App }))
