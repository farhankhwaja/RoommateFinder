'use strict';

angular.module('MovIn')
    .directive('myMap', function($compile){
		return {
			template : '<div class="container"></div>',
			replace: true,
			restrict: 'A',
			scope: {
				latitude: '=latitude',
				longitude: '=longitude',
				marks: '=marks',
				distance: '=distance',
				hitMe: '=hitMe'
			},
			link: function(scope, element, attrs){

				var map, mapOptions, myLatLng, circle, currentSelectedMarker;
				var locations = [];
				var counter = {};
				var icon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
				var clicked = false;

				var Location = function(latlon, message, username, address, count){
					this.latlon = latlon;
					this.message = message;
					this.username = username;
					this.address = address;
					this.count = count;
					// this.favlang = favlang
				};

				function initMap(){
					locations = [];
					counter = {
					};
					myLatLng = new google.maps.LatLng(scope.latitude,scope.longitude);

					mapOptions = {
						zoom: 14,
						center: myLatLng,
						mapTypeId: google.maps.MapTypeId.ROADMAP
					};					
					// Create a new map and place in the index.html page
					map = new google.maps.Map(document.getElementById('map'), mapOptions);

					if(scope.marks !== [] || scope.marks !== undefined){
						for(var i = 0; i < scope.marks.length; i++){
							if(scope.marks[i].address in counter){
								counter[scope.marks[i].address].count += 1;
								counter[scope.marks[i].address].places.push(scope.marks[i]);

							}else{
								counter[scope.marks[i].address] = {
									count: 1,
									places: []
								};
								counter[scope.marks[i].address].places.push(scope.marks[i]);
							}
						}

						for(var i in counter){
							var  contentString = "";
							for(var j in counter[i].places){
								var aptInfo = counter[i].places[j];
								contentString += '<div><label>Rent: </label><b> $' + aptInfo.rent +' (Monthly) </b> <br/> <label>Apt #:</label><b> '+ aptInfo.aptNo + '</b><br /><label>Rooms/Baths:</label><b> '+ aptInfo.no_rooms + '/' + aptInfo.baths + '</b>' +
										'<br>' + '<label>Sq. Ft:</label><b> '+ aptInfo.sq_ft + '</b> <br/>'+'<a href ng-click="$parent.toggleModal(\''+ aptInfo._id +'\')">' + '<b>More Info</b>' +'</a>'+
										'</div>';
							}

							if(counter[i].count > 1){
								var finalContent = '<div><div class="infoWindowHolder" ng-show="true"></div><div id="infoWindowContainer">' + contentString + '</div></div>';
							}else{
								var finalContent = '<div><div class="infoWindowHolder" ng-show="false"></div><div id="infoWindowContainer">' + contentString + '</div></div>';
							}
							var compiledString = $compile(finalContent)(scope);

							locations.push(new Location(
								new google.maps.LatLng(counter[i].places[0].location.coordinates[1], counter[i].places[0].location.coordinates[0]),
								new google.maps.InfoWindow({
									content: compiledString[0],
									maxWidth: 320
								}),
								'',
								'',
								counter[i].count
							));
						}
						locations.forEach(function(n, i){
							// console.log(n);
							var marker = new google.maps.Marker({
								position: n.latlon,
								map: map,
								title: n.username,
								label: String(n.count),
								// icon: icon,
							});
						
							google.maps.event.addListener(marker, 'click', function(e){

								if(!clicked){
									currentSelectedMarker = n;
									n.message.open(map, marker);
								}
								
								$('#map').contents().find('.infoWindowHolder').jPages({
									containerID : "infoWindowContainer",
						            perPage: 1
								});
							});
						});
					}

					circle = new google.maps.Circle({
						map: map,
						radius: 1609 * parseFloat(scope.distance),    // 10 miles in metres
						fillColor: '#AA0000',
						strokeColor: "#ff656c",
						center: myLatLng
					});
			};

			scope.$watchGroup(['hitMe', 'marks'], function(newValues, oldValues){
				// console.log("Group Watch", newValues[0], newValues[1]);
				if (newValues[0] || newValues[1]) { 
					initMap();
				}
			});

			// scope.$watch('hitMe', function(newValue, oldValue){
			// 	console.log('changed', newValue);
			// 	if (newValue) { 
			// 		initMap();
			// 	}
			// });
		}
	};
    });