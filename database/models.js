module.exports = function (db) {
// Items
    db.define('list', {
    	id:  { type: 'serial', key: true },
        name : String
    });    

	db.define('item', {
    	id:  { type: 'serial', key: true },
        list: Number, // Long
        name : String,
        count: Number, //Int
        status: String, // TODO: replace by enum
    });
};