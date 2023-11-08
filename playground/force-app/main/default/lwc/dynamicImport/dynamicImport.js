import { LightningElement } from 'lwc'

const MODULES = {
  testComponent: () => import('c/testComponent'),
  onPlatformLwc: () => import('c/onPlatformLwc'),
}

export default class DynamicImport extends LightningElement {
  moduleLwc
  moduleKey = 'testComponent'

  handleToggleImport = async () => {
    this.moduleKey =
      this.moduleKey === 'testComponent' ? 'onPlatformLwc' : 'testComponent'

    this.moduleLwc = (await MODULES[this.moduleKey]()).default
  }
}
