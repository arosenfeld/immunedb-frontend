import alt from '../altApp';

import API from '../api';

class SampleActions {
  constructor() {
    this.generateActions('setAsyncState', 'setSamples');
  }

  getAll() {
    return (dispatch) => {
      setTimeout(() => {
        this.actions.setAsyncState('loading');
        API.post('samples/list').end((err, response) => {
          if (err) {
            this.actions.setAsyncState('error');
          } else {
            this.actions.setSamples(response.body);
            this.actions.setAsyncState('loaded');
          }
        });
      });
    }
  }
}

export default alt.createActions(SampleActions);
