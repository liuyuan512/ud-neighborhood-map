var map;


    // Create a new blank array for all the listing markers.
    var markers = [];
    //初始化地图
    function initMap() {


      //创建地图的样式
      var styles = [
        {
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#ebe3cd"
            }
          ]
        },
        {
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#523735"
            }
          ]
        },
        {
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#f5f1e6"
            }
          ]
        },
        {
          "featureType": "administrative",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#c9b2a6"
            }
          ]
        },
        {
          "featureType": "administrative.land_parcel",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#dcd2be"
            }
          ]
        },
        {
          "featureType": "administrative.land_parcel",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#ae9e90"
            }
          ]
        },
        {
          "featureType": "landscape.natural",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#93817c"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#a5b076"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#447530"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#f5f1e6"
            }
          ]
        },
        {
          "featureType": "road.arterial",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#fdfcf8"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#f8c967"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#e9bc62"
            }
          ]
        },
        {
          "featureType": "road.highway.controlled_access",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#e98d58"
            }
          ]
        },
        {
          "featureType": "road.highway.controlled_access",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#db8555"
            }
          ]
        },
        {
          "featureType": "road.local",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#806b63"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#8f7d77"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#ebe3cd"
            }
          ]
        },
        {
          "featureType": "transit.station",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#b9d3c2"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#92998d"
            }
          ]
        }
      ];
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 37.475225, lng: 121.45405},
      zoom: 13,
      styles:styles,
      mapTypeControl:false
    });

    // 绑定knockout
    ko.applyBindings(new ViewModel());
}

// 地点的model，数据来源：谷歌地图
var locations = [
  {title:'烟台大学(西门)',location:{lat: 37.475225, lng: 121.45405},id:'7c3578db05045cda8f1a89fa'},
  {title:'清泉学校退休职工部',location:{lat: 37.484147, lng: 121.447786},id:'618a132aeed7844b465726b8'},
  {title:'烟台银行',location:{lat: 37.476001, lng: 121.453275},id:'a5ef680f0796f0d4b9df8f09'},
  {title:'汉堡王',location:{lat: 37.479689, lng: 121.452184},id:'a87f1519342c10f8ebe582e9'},
  {title:'天隆酒店',location:{lat: 37.484026, lng: 121.4566475},id:'e6ee2fd237fbdd492b11d150'},
  {title:'海边咖啡开餐',location:{lat: 37.483162, lng: 121.454764},id:'dffd4642901b73b33c9a5e53'}
];

// 地点构造函数
var Place = function(data) {
    this.title = ko.observable(data.title);
    this.lat = ko.observable(data.lat);
    this.lng = ko.observable(data.lng);
    this.marker = ko.observable();
    this.id = ko.observable(data.id);
    this.address = ko.observable('');
    this.picId = ko.observable('');
    this.tag = ko.observable('');
    this.rating = ko.observable('');
    this.comment = ko.observable('');
};



// ViewModel
var ViewModel = function() {

    // 绑定this
    var self = this;

    // 生成地点列表数组
    self.placeList = ko.observableArray();
    locations.forEach(function(location) {
        self.placeList.push(new Place(location));
    });
    // 生成地图上的小窗口
    var infoWindow = new google.maps.InfoWindow();

    // 生成地点标记
    var marker;

    //生成边界
    var bounds = new google.maps.LatLngBounds();

    // 创建过滤列表数组
    self.filteredList = ko.observableArray();

      //给每个地点标记设定小窗口
      for (var i = 0; i < locations.length; i++) {

            // Get the position from the location array.
            var position = locations[i].location;
            var title = locations[i].title;
            var uid = locations[i].id;
            locations[i].marker = ko.observable();
            // Create a marker per location, and put into markers array.
              marker = new google.maps.Marker({
              map: map,
              position: position,
              title: title,
              animation: google.maps.Animation.DROP,
              id: i,
              uid:uid
            });
            // Push the marker to our array of markers.
              markers.push(marker);
            // Create an onclick event to open an infowindow at each marker.
              marker.addListener('click', function() {
              populateInfoWindow(this, infoWindow);
              });

            bounds.extend(markers[i].position);

            self.filteredList.push(locations[i]);
            locations[i].marker(marker);
        }

            map.fitBounds(bounds);


            // 创建过滤关键字
            self.keyword = ko.observable('');

            // 过滤方法
            self.filter = function() {
                // 先将列表清空
                self.filteredList([]);

                // 获取过滤关键字和地点列表
                var filterKeyword = self.keyword();
                var list = self.placeList();

                // 遍历地点列表，若含有关键字，则使其在列表栏和地图上显示出来
                list.forEach(function(place) {
                    if (place.title().indexOf(filterKeyword) != -1) {
                        self.filteredList.push(place);
                    }
                });

                markers.forEach(function(marker){
                  if(marker.title.indexOf(filterKeyword) >= 0){
                    marker.setMap(map);
                  }else {
                    marker.setMap(null);
                  }
                });
            };

            //同步列表页的点击事件
            self.showInfo = function(place){
                var mkr = place.marker();
                google.maps.event.trigger(mkr, 'click');

            };



      function populateInfoWindow(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
          infowindow.marker = marker;
          marker.setAnimation(4);
          var position = infowindow.getPosition();

          infowindow.open(map, marker);
          // Make sure the marker property is cleared if the infowindow is closed.
          infowindow.addListener('closeclick',function(){
            infowindow.setMarker = null;
          });
          zoomInMarker(marker);
          // showLocationDetail(marker);
          showBmapLocationDetail(marker);
          // showYelpLocationDetail(marker);
        }
      }

      function showLocationDetail(marker){

          var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
              marker.position.lat() +
              "," +
              marker.position.lng() +
              "&key=AIzaSyDhs0w_8_AKpIJi7GF52ECiFjYObU8obr0&v=3&v=3";

          //make ajax request to foursquare api
          $.ajax({
              url : url
              //do response success handling
          }).done(function(data, textStatus, jqXhr){
             console.log(data);
             var detailString = "";
             if(data.status === "OK"){
                  detailString +="<h4>"+ marker.title + "<h4>";
                  var place_id = data.results[0].place_id;

                 detailString += "<div>地址ID:" + place_id + "</div>";

                 var formatted_address = data.results[0].formatted_address;
                 detailString += "<div>详情:" + formatted_address + "</div>";

                 var geometry = data.results[0].geometry;
                 detailString += "<div>类型:" + geometry.location_type + "</div>";
                 detailString += "<div>纬度:" + geometry.location.lat + "</div>";
                 detailString += "<div>经度:" + geometry.location.lng + "</div>";
                 infoWindow.setContent(detailString);
             }
              //do response error handling
          }).fail(function(jqXhr, textStatus, errorThrown){
              console.log( "textStatus:" + textStatus + ", errorThrown:" +errorThrown);
              //do ajax logging on the browser console
          }).always (function(jqXHROrData, textStatus, jqXHROrErrorThrown) {
              console.log( "ajax request to foursquare is completed, textStatus:" + textStatus);
          });
      }

      //设置地图以标记点为中心并且放大
      function zoomInMarker(marker){
          map.setCenter(marker.getPosition());
          map.setZoom(16);
      }


       function showBmapLocationDetail(marker){
        // 使用百度Place API 获取地点详情

        var ajaxUrl = "http://api.map.baidu.com/place/v2/detail?uid=" + marker.uid + "&output=json&scope=2&ak=0wvDo2Nsf3VoXx7BUwEj3HLlFS6csNTa";
        $.ajax({
            url: ajaxUrl,
            type: "GET",
            dataType: "JSONP"
        }).done(function(data) {

           var detailString = '';
            // 判断获取数据状态
            if (data.status === 0) {
                // 获取地址
                var address = '地址：' + data.result.address;
                detailString +='<p>'+address + '</p>';
                // 获取图片id（如果有）
                var picId = data.result.hasOwnProperty('street_id') ? data.result.street_id : '';
                detailString +='<p>'+picId + '</p>';
                // 判断是否有详情数据
                if (data.result.hasOwnProperty('detail_info')) {
                    // 获取标签（如果有）
                    var tag = data.result.detail_info.hasOwnProperty('tag') ? '标签：' + data.result.detail_info.tag : '';
                    detailString +='<p>'+tag + '</p>';
                    // 获取评分（如果有）
                    var rating = data.result.detail_info.hasOwnProperty('overall_rating') ? '评分：' + data.result.detail_info.overall_rating : '';
                    detailString +='<p>'+rating + '</p>';
                    // 获取评价数组（如果有）
                    var reviews = data.result.detail_info.hasOwnProperty('di_review_keyword') ? data.result.detail_info.di_review_keyword : '';
                    // 创建一个空数组，用来将遍历的数组数据转换成字符串
                    var comment = [];
                    if (reviews != []) {
                        reviews.forEach(function(review) {
                            if (review.hasOwnProperty('keyword')) {
                                comment.push(review.keyword);
                            }
                        });
                        if (comment != []) {
                            detailString +='<p>'+'热评：' + comment.toString() + '</p>';
                        }
                    }

                }
                // 设定小窗口内容
                    infoWindow.setContent(detailString);

            } else {
                var content = '<h4>地点数据获取失败，没有这个地点的数据<h4>'; // 若数据获取失败，则设定小窗口内容为错误信息
                infoWindow.setContent(content);
            }
  }).fail(function() {
      alert("地点数据获取失败，请刷新页面重试"); // ajax数据获取失败时的事件
    });
  }
};
