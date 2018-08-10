function handleError(reject, err) {
  console.log('FETCH ERROR: ', err);
  if (err instanceof TypeError) {
    reject({ err: `Failed to connect to Backend` });
  } else if (err.includes('err') && err.includes('field')) {
    reject(err);
  } else {
    reject({ err: 'An unknown error has occurred. Please try again later.' });
  }
}

export function get(url) {
  return new Promise((resolve, reject) => {
    fetch(`/${url}`, {
      headers: {
        'content-type': 'application/json',
      },
      method: 'GET',
    })
      .then(res => {
        if (res.ok) return resolve(res.json());
        res.json().then(json => handleError(reject, json));
      })
      .catch(err => handleError(reject, err));
  });
}

export function post(url, data) {
  return new Promise((resolve, reject) => {
    fetch(`/${url}`, {
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json',
      },
      method: 'POST',
    })
      .then(res => {
        if (res.ok) return resolve(res.json());
        res.json().then(json => handleError(reject, json));
      })
      .catch(err => handleError(reject, err));
  });
}

export function postFormData(url, data) {
  return new Promise((resolve, reject) => {
    fetch(`/${url}`, {
      body: data,
      method: 'POST',
    })
      .then(res => {
        if (res.ok) return resolve(res.json());
        res.json().then(json => handleError(reject, json));
      })
      .catch(err => handleError(reject, err));
  });
}

export function postFileData(url, files, data) {
  const fileSendObj = new FormData();
  files.forEach(file => {
    fileSendObj.append('file', file);
  });
  if (data) {
    for (let key in data) {
      fileSendObj.append(key, data[key]);
    }
  }
  return postFormData(url, fileSendObj);
}
