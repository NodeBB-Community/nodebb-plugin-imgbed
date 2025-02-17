'use strict';

define('admin/plugins/imgbed', ['settings', 'alerts'], function (settings, alerts) {
	var Imgbed = {};

	Imgbed.init = function () {
		var wrapper = $('#imgbed_acp');
	
		settings.sync('imgbed', wrapper);
		
		$('#save').click(function (event) {
			event.preventDefault();
			// TODO clean and organize extensions
			settings.persist('imgbed', wrapper, function persistImgbed() {
				socket.emit('admin.settings.syncImgbed');
			});	
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
	 