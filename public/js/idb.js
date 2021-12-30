let db;

const request = indexedDB.open('budget-tracker', 1);

request.onupgradeneeded = function (event) {
    const db = event.target.result;
    db.createObjectStore('new_item', { autoIncrement: true });
};

// upon a successful 
request.onsuccess = function (event) {
    db = event.target.result;
    if (navigator.onLine) {
        uploadExpenses();
    }
};

request.onerror = function (event) {
    console.log(event.target.errorCode);
};

// This function will be executed if we attempt to submit a new item and there's no internet connection
function saveRecord(record) {
    // open a new transaction with the database with read and write permissions 
    const transaction = db.transaction(['new_transaction'], 'readwrite');

    // access the object store for `new_pizza`
    const itemObjectStore = transaction.objectStore('new_item');

    // add record to your store with add method
    itemObjectStore.add(record);
}

//function to upload transaction
function uploadExpenses() {
    const transaction = db.transaction(['new_transaction', 'readwrite']);
    const itemObjectStore = transaction.objectStore('new-transaction');
    //get all records set to a variable
    const getAll = itemObjectStore.getAll();

    getAll.onsuccess = function () {
        if (getAll.result.length > 0) {
            fetch('/api/transaction', {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => response.json())
                .then((serverResponse) => {
                    if (serverResponse.message) {
                        throw new Error(serverResponse);
                    }
                    const transaction = db.transaction(['new-transaction'], 'readwrite');
                    const itemObjectStore = transaction.objectStore('new-transaction');
                    itemObjectStore.clear();
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    };
}

window.addEventListener('online', uploadExpenses);