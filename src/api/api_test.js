
import * as API from './'

export default {

  getValue: params => {
    return API.POST('/api/v1/test/getValue',params)
  }
}
