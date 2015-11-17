import alt from '../altApp';

import SampleActions from '../actions/samples';

class SampleStore {
  constructor() {
    this.bindActions(alt.getActions('SampleActions'));
    this.state = {
      samples: [],
      asyncState: '',
      asyncError: '',
    };
  }

  setAsyncState(value) {
    this.setState({
      asyncState: value
    });
  }

  setAsyncError(value) {
    this.setState({
      asyncError: value
    });
  }

  setSamples(samples) {
    this.setState({
      samples: samples
    });
  }
}

export default alt.createStore(SampleStore, 'SampleStore');
