module.exports = function (db, callback) {

    db.define('list', {
        id:  { type: 'serial', key: true },
        name : String
    });    


    db.define('item', {
        id:  { type: 'serial', key: true },
        list: Number,   // Int
        name : String,
        count: Number,  // Int
        status: String, // TODO: replace by enum
        rank: Number   // Int
    });

    callback && callback();
};