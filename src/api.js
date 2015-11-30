import request from 'superagent';

class API {
  constructor(url) {
    this.url = url;
  }

  post(path, data) {
    let req = request.post(this.url + '/' + path);
    return req.send(data);
  }
}

export default new API('http://clash.biomed.drexel.edu:5001');
