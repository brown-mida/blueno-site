// Should be changed as appropriate

let BASE_URI;
if (window.location.host.startsWith('http')) {
    BASE_URI = window.location.host;
} else {
    // Do we still need this?
    BASE_URI = 'http://localhost:8080';
}

export { BASE_URI };

function handleError(reject, err) {
    console.log('FETCH ERROR: ', err);
    if (err instanceof TypeError) {
        reject({ err: `Failed to connect to ${BASE_URI}`})
    } else if (err.includes('err') && err.includes('field')) {
        reject(err);
    } else {
        reject({ err: 'An unknown error has occurred. Please try again later.' });
    }
}

export function get(url) {
    return new Promise((resolve, reject) => {
        fetch(`${BASE_URI}/${url}`, {
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
        fetch(`${BASE_URI}/${url}`, {
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
        fetch(`${BASE_URI}/${url}`, {
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
