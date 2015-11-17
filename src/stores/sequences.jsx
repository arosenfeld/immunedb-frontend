import alt from '../altApp';

import SequenceActions from '../actions/sequences';

class SequenceStore {
  constructor() {
    this.bindActions(alt.getActions('SequenceActions'));
    this.state = {
      sequences: [],
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

  setSequences(sequences) {
    this.setState({
      sequences
    });
  }
}

export default alt.createStore(SequenceStore, 'SequenceStore');
