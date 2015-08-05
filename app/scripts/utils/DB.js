var lowdb = require('lowdb');

var db = lowdb('../../logos.json'),
	logos = db('items');

console.log(logos.chain().sortByOrder(['added', 'name'], ['desc', 'asc']).value());
//console.log(logos.chain().where({ added: '2015-07-24' }).sortByOrder(['added', 'name'], ['desc', 'asc']).value());