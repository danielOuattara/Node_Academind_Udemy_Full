const fetchData = () => {
    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('Done!');
        }, 1500);
    });
    return promise;
};


const fetchDataError = () => {
    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            reject('Error!');
        }, 2500);
    });
    return promise;
};

//-------------------------------------------------------------

setTimeout(() => {
    console.log('Timer is done!');
    fetchData()
    .then(text => {
        console.log(text);
        return fetchData();
    })
    .then(text2 => {
        console.log(text2);
    });

    fetchDataError()
    .then(text =>console.log(text))
    .catch(err => console.log(err))
}, 2000);

console.log('Hello!');
console.log('Hi!');
