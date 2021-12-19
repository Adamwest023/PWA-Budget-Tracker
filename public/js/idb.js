let db;

const request = indexedDB.open('budget-tracker', 1);

request.onupgradeneeded = function(event) {
    //save a reference to the database
    const db = event.target.result;
    // create an object store(table) called `new_item`, set it to have 
    //an auto incrementing primary key of sorts
    db.createObjectStore('new_item', {autoIncrement: true});
};