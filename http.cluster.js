var Proxy = require('./lib/proxy');
var Cluster = require('cluster2');
var fs = require('fs');
var _ = require('underscore');
var Model = require('scuttlebutt/model');
var Net = require('net');
var model = new Model();
var monitor = require('./monitor')();

module.exports = function(port, config, handlers){
		
	if('number' !== typeof port) {
		if(!Array.isArray(port)){
			throw new Error ('You must give a port number or array of port numbers');
			return			
		}
	};

	var config = config;

	if('string' == typeof config){
		try{
			config = JSON.parse(config)
		}
		catch(err){
			throw new Error('\nConfig must be an object or a JSON string')
		}
	};

	if(!config) {
		
		console.log('\nNo config provided. Using ./configs/sample.config.json');
		
	};
	
	var proxyServer = Proxy(config, handlers, true);
		
	var c = new Cluster({
	    port: port,
		monitor: monitor
	});

	
    var r = {};

	r.start = function(){
		c.listen(function(cb) {
		    cb(proxyServer.server);
		});	
	};
	
	r.quit = function(){
		c.stop();
	};
	
	r.close = function(){
		c.shutdown();
	};
	
	r.config = proxyServer.config;
		
	return r
	
};
