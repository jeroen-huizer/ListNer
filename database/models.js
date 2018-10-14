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

    db.define('user', {
      id:  { type: 'serial', key: true },
      username: String,
      password:  String,
      firstname: String,
      lastname: String
    });

    callback && callback();
};
