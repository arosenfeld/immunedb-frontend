import alt from '../altApp';

import API from '../api';

class SequenceActions {
  constructor() {
    this.generateActions('setAsyncState', 'setSequences');
  }

  getAll() {
    return (dispatch) => {
      setTimeout(() => {
        this.actions.setAsyncState('loading');
        API.post('sequences/list').end((err, response) => {
          if (err) {
            this.actions.setAsyncState('error');
          } else {
            this.actions.setSequences(response.body);
            this.actions.setAsyncState('loaded');
          }
        });
      });
    }
  }
}

export default alt.createActions(SequenceActions);
