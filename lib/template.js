"use strict";

module.exports = function (ccg) {
	// ---
	// ccg.loadTemplate
	// ---
	// Loads a template
	// play, data and cb are optional
	//
	// [CG ADD](http://casparcg.com/wiki/CasparCG_2.0_AMCP_Protocol#CG_ADD)
	
	ccg.prototype.cgAdd = function (video_channel, video_layer, template, cg_layer, play, data, cb) {
		var self = this;

		// console.log(video_channel);
		// console.log(video_layer);
		// console.log(template);
		// console.log(cg_layer);
		// console.log(play);
		// console.log(data);

		// video_channel
		video_channel = checkIfIsString(video_channel);
		// video_layer
		video_layer = checkIfIsString(video_layer);
		// template
		template = checkIfIsString(template);
		template = template.replace(/\\/g, "\\\\");
		// cg_layer
		cg_layer = checkIfIsString(cg_layer);
		// play
		play = checkIfIsString(play);

		// videoChannelAndLayer
		let videoChannelAndLayer = video_channel + "-" + video_layer;

		// Check videoChannelAndLayer
		if (typeof(videoChannelAndLayer) != "string" || !/[0-9]+-[0-9]+/.test(videoChannelAndLayer)) {
			self.log("Invalid channel");
			return cb && cb(new Error("Invalid channel"));
		}

		data = processJsonData(data);
		// if (typeof(data) == "object") {
		// 	data = self.datObJectToXml(data);
		// }
		
		let cmd = "CG " + videoChannelAndLayer + " ADD " + cg_layer + " \"" + template + "\" " + play + " " + data;
		
		// console.log(cmd);

		self.sendCommand(cmd, cb);
	}

	// ---
	// ccg.cgUpdate
	// ---
	// Loads a template
	// play, data and cb are optional
	//
	// [CG ADD](http://casparcg.com/wiki/CasparCG_2.0_AMCP_Protocol#CG_ADD)
	
	ccg.prototype.cgUpdate = function (video_channel, video_layer, cg_layer, data, cb) {
		var self = this;

		// video_channel
		video_channel = checkIfIsString(video_channel);
		// video_layer
		video_layer = checkIfIsString(video_layer);
		// cg_layer
		cg_layer = checkIfIsString(cg_layer);
		
		// videoChannelAndLayer
		let videoChannelAndLayer = video_channel + "-" + video_layer;

		// Check videoChannelAndLayer
		if (typeof(videoChannelAndLayer) != "string" || !/[0-9]+-[0-9]+/.test(videoChannelAndLayer)) {
			self.log("Invalid channel");
			return cb && cb(new Error("Invalid channel"));
		}

		data = processJsonData(data);
		// if (typeof(data) == "object") {
		// 	data = self.datObJectToXml(data);
		// }
		
		let cmd = "CG " + videoChannelAndLayer + " UPDATE " + cg_layer + " " + data;
		
		// console.log(cmd);

		self.sendCommand(cmd, cb);
	}




	/**
	 *
	 * Check If Value Is  String
	 *
	 */
	 var checkIfIsString = function (value) {
		
		if (typeof(value) != "string") {
			value = value.toString();
		}

		return value;
	};

	let processJsonData = function ( data )
	{
		if( data === null || data === false || data === "" )
		{
			data = {};
		}

		let stringCast = null;

		if (typeof data === 'object') {
            stringCast = JSON.stringify(data);
            
            // console.log(stringCast);

            // escaping
	        stringCast = stringCast.replace(/([\\\"])/g, '\\$1');
	        // add qoutation
	        let quotedString = `"${stringCast}"`;
	        
	        // console.log(stringCast);

	        return quotedString;


        }else {
        	data = {};
        	// console.log('no es nada');
        	return data;
        }   
	}

	ccg.prototype.loadTemplate = function (channel, file, play, data, cb) {
		var self = this;

		if (typeof(play) == "object" || typeof(play) == "string") {
			cb = data;
			data = play;
			play = false;
		}

		if (typeof(play) == "function") {
			cb = play;
			data = {};
			play = false;
		}

		if (typeof(data) == "function") {
			cb = data;
			data = {};
		}

		if (typeof(cb) != "function") {
			cb = false;
		}

		if (typeof(channel) == "number") {
			channel = channel.toString();
		}

		if (typeof(channel) != "string" || !/[0-9]+-[0-9]+/.test(channel)) {
			self.log("Invalid channel");
			return cb && cb(new Error("Invalid channel"));
		}

		if (typeof(file) != "string") {
			self.log("Invalid file");
			return cb && cb(new Error("Invalid file"));
		}

		if (typeof(data) == "object") {
			data = self.datObJectToXml(data);
		}

		var cmd = "CG " + channel;
		cmd += " ADD 1 \"" + file.replace(/\\/g, "\\\\") + "\" ";
		cmd += (play ? "1" : "0") + " ";
		cmd += "\"" + data + "\"";
		console.log(cmd)
		self.sendCommand(cmd, cb);
	};

	// ---
	// standard cg command
	// ---
	var sendCgCommand = function (self, cmd, channel, cb) {
		if (typeof(cb) != "function") {
			cb = false;
		}

		if (typeof(channel) == "number") {
			channel = channel.toString();
		}

		if (typeof(channel) != "string" || !/[0-9]+-[0-9]+/.test(channel)) {
			self.log("Invalid channel");
			return cb && cb(new Error("Invalid channel"));
		}

		self.sendCommand("CG " + channel + " " + cmd + " 1", cb);
	};

	// ---
	// ccg.playTemplate
	// ---
	// Plays a visible template from a specific layer
	//
	// [CG PLAY](http://casparcg.com/wiki/CasparCG_2.0_AMCP_Protocol#CG_PLAY)
	ccg.prototype.playTemplate = function (channel, cb) {
		sendCgCommand(this, "PLAY", channel, cb);
	};

	// ---
	// ccg.advanceTemplate
	// ---
	// Advances a visible template from a specific layer
	//
	// [CG NEXT](http://casparcg.com/wiki/CasparCG_2.0_AMCP_Protocol#CG_NEXT)
	ccg.prototype.advanceTemplate = function (channel, cb) {
		sendCgCommand(this, "NEXT", channel, cb);
	};

	// ---
	// ccg.stopTemplate
	// ---
	// Stops a visible template from a specific layer
	//
	// [CG STOP](http://casparcg.com/wiki/CasparCG_2.0_AMCP_Protocol#CG_STOP)
	ccg.prototype.stopTemplate = function (channel, cb) {
		sendCgCommand(this, "STOP", channel, cb);
	};

	// ---
	// ccg.removeTemplate
	// ---
	// Removes a visible template from a specific layer
	//
	// [CG REMOVE](http://casparcg.com/wiki/CasparCG_2.0_AMCP_Protocol#CG_REMOVE)
	ccg.prototype.removeTemplate = function (channel, cb) {
		sendCgCommand(this, "REMOVE", channel, cb);
	};

	// ---
	// ccg.clearTemplate
	// ---
	// Clears layer and resets Flash Player
	//
	// [CG CLEAR](http://casparcg.com/wiki/CasparCG_2.0_AMCP_Protocol#CG_CLEAR)
	ccg.prototype.clearTemplateLayer = function (channel, cb) {
		sendCgCommand(this, "CLEAR", channel, cb);
	};

	// ---
	// cg command plus data
	// ---
	var sendCgDataCommand = function (self, cmd, channel, data, cb) {
		if (typeof(cb) != "function") {
			cb = false;
		}

		if (typeof(channel) == "number") {
			channel = channel.toString();
		}

		if (typeof(channel) != "string" || !/[0-9]+-[0-9]+/.test(channel)) {
			self.log("Invalid channel");
			return cb && cb(new Error("Invalid channel"));
		}

		if (typeof(data) != "string") {
			data = self.datObJectToXml(data);
		}

		if (typeof(data) != "string") {
			self.log("Invalid data");
			return cb && cb(new Error("Invalid data"));
		}

		self.sendCommand("CG " + channel + " " + cmd + " 1 \"" + data + "\"", cb);
	};

	// ---
	// ccg.updateTemplateData
	// ---
	// Updates a loaded templates data
	//
	// [CG UPDATE](http://casparcg.com/wiki/CasparCG_2.0_AMCP_Protocol#CG_UPDATE)
	ccg.prototype.updateTemplateData = function (channel, data, cb) {
		sendCgDataCommand(this, "UPDATE", channel, data, cb);
	};

	// ---
	// ccg.callTemplateMethod
	// ---
	// Calls a AS method inside of the template
	//
	// [CG INVOKE](http://casparcg.com/wiki/CasparCG_2.0_AMCP_Protocol#CG_INVOKE)
	ccg.prototype.callTemplateMethod = function (channel, method, cb) {
		sendCgDataCommand(this, "INVOKE", channel, method, cb);
	};
};
