'use strict';

angular.module('userAuthApp')
  .factory('warmStartupSvc', function ($http, ApiModel) {
		var currentItem = {
      started: new Date()
    };

    function restart() {
			currentItem.started = new Date();
		}

		function getAllConfigs() {
      return $http.get(ApiModel.CONFIGS.ALL);
    }

		return {
			currentItem: currentItem,
			restart: restart,
      getAllConfigs: getAllConfigs
		};
  });
