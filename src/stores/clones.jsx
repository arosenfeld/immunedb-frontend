import alt from '../altApp';

import CloneActions from '../actions/clones';

class CloneStore {
  constructor() {
    this.bindActions(alt.getActions('CloneActions'));
    this.state = {
      clones: [],
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

  setClones(clones) {
    this.setState({
      clones
    });
  }
}

export default alt.createStore(CloneStore, 'CloneStore');
