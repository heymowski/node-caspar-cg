"use strict";

module.exports = function (ccg) {

	/**
	 *
	 * Restart Caspar Server
	 *
	 */
	ccg.prototype.restartCaspar = function (cb) {

		var self = this;

		var cmd = "RESTART";

		self.sendCommand(cmd, cb);
	};

	/**
	 *
	 * Stop / Kill Caspar Server
	 *
	 */
	ccg.prototype.stopCaspar = function (cb) {

		var self = this;

		var cmd = "KILL";

		self.sendCommand(cmd, cb);
	};

};
