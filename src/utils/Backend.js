// Should be changed as appropriate
const BASE_URI = 'http://localhost:8080/';
// const BASE_URI = 'http://ec2-34-229-105-203.compute-1.amazonaws.com:5000/';

function handleError(reject, err) {
    console.log('FETCH ERROR: ', err);
    if (err.includes('err') && err.includes('field')) {
        reject(err);
    } else {
        reject({ err: 'An unknown error has occurred. Please try again later.' });
    }
}

export function get(url) {
    return new Promise((resolve, reject) => {
        fetch(`${BASE_URI}${url}`, {
            headers: {
                'content-type': 'application/json',
            },
            method: 'GET',
            credentials: 'include',
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
        fetch(`${BASE_URI}${url}`, {
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
        fetch(`${BASE_URI}${url}`, {
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
    files.forEach((file) => {
        fileSendObj.append('file', file);
    });
    if (data) {
        for (let key in data) {
            fileSendObj.append(key, data[key]);
        }
    }
    return postFormData(url, fileSendObj);
}
