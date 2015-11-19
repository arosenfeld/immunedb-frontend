import alt from '../altApp';

import API from '../api';

class CloneActions {
  constructor() {
    this.generateActions('setAsyncState', 'setClones');
  }

  getClones(page, filters, perPage) {
    return (dispatch) => {
      setTimeout(() => {
        this.actions.setAsyncState('loading');
        API.post('clones/list', {filters, page, per_page: perPage}).end((err, response) => {
          if (err) {
            this.actions.setAsyncState('error');
          } else {
            this.actions.setClones(response.body);
            this.actions.setAsyncState('loaded');
          }
        });
      });
    }
  }

  getClone(cloneId) {
    return (dispatch) => {
      setTimeout(() => {
        this.actions.setAsyncState('loading');
        API.post('clone/' + cloneId).end((err, response) => {
          if (err) {
            this.actions.setAsyncState('error');
          } else {
            this.actions.setClones([response.body]);
            this.actions.setAsyncState('loaded');
          }
        });
      });
    }
  }
}

export default alt.createActions(CloneActions);
