'use strict';
console.log('top')
define('admin/plugins/imgbed', ['settings', 'alerts'], function (settings, alerts) {
		console.log('inside')
	var Imgbed = {};

	Imgbed.init = function () {
		var wrapper = $('#imgbed_acp');
	
		settings.sync('imgbed', wrapper);
		console.log('init done')
		$('#save').click(function (event) {
			event.preventDefault();
			// TODO clean and organize extensions
			settings.persist('imgbed', wrapper, function persistImgbed() {
				socket.emit('admin.settings.syncImgbed');
			});
			console.log('hero dero')
			return false;
		});

		$('#clearPostCache').click(function (event) {
			event.preventDefault();
			socket.emit('admin.settings.clearPostCache');
			alerts.alert({
				type: 'success',
				alert_id: 'imgbed-post-cache-cleared',
				title: 'Success',
				message: 'Posts cache cleared successfully'
			});
		});
	};

	return Imgbed;	
});
	 