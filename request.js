var request = require("request")

var url = 'https://raw.githubusercontent.com/gilbarbara/logos/master/assets/logos.json',
	vars = {
		tags: {},
		list: []
	},
	tags;

function sortObject(obj) {
	var arr = [];
	for (var prop in obj) {
		if (obj.hasOwnProperty(prop)) {
			arr.push({
				'key': prop,
				'value': obj[prop]
			});
		}
	}
	arr.sort(function(a, b) { return b.value - a.value; });
	//arr.sort(function(a, b) { a.value.toLowerCase().localeCompare(b.value.toLowerCase()); }); //use this to sort as strings
	return arr; // returns array
}

request({
	url: url,
	json: true
}, function (error, response, body) {

	if (!error && response.statusCode === 200) {
		vars.logos = body.items;
		
		vars.logos.forEach(function (d, i) {
			d.tags.forEach(function (t) {
				
				vars.list.push(t);
				if (!vars.tags.hasOwnProperty(t)) {
					vars.tags[t] = 0;
				}
				vars.tags[t]++;
			});
		});
		
		tags = sortObject(vars.tags);
		console.log(tags);
		console.log(tags.length);
		
		console.log(vars.list.join('", "'));
	}
})