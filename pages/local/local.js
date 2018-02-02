const app = getApp();
const QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');
const tsMap = require('../../constants/tsMap.js');
const weather = require('../../constants/weather.js');

let qqmapsdk;

Page({
  data: {
    latitude: null,
    longitude: null,
    district: null,
    city: null,
    key: tsMap.key,
    wetherKey: weather.key,
    nowUrl: weather.nowUrl,
    futureUrl: weather.futureUrl,
    now: {},
    forecast: [],
  },

  onLoad: function() {
    qqmapsdk = new QQMapWX({
      key: this.data.key
    });
    this.bindGetWeather();
  },

  bindGetWeather: function() {
    let that = this;
    let latitude, longitude, city, district, now, forecast;
    wx.getLocation({
      type: 'wgs84',
      success: res => {
        latitude = res.latitude;
        longitude = res.longitude;
      },
      complete: function() {
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude,
          },
          success: function(res) {
            city = res.result.address_component.city;
            district = res.result.address_component.district;
            that.setData({
              latitude: latitude,
              longitude: longitude,
              city: city,
              district: district,
            });
          },
          complete: function() {
            wx.request({
              url: `${that.data.nowUrl}${city}&key=${that.data.wetherKey}`,
              success: function(res) {
                now = res.data.HeWeather6[0].now;
                that.setData({
                  now: now,
                });
                console.log('that', that.data.now);
              },
            });
            wx.request({
              url: `${that.data.futureUrl}${city}&key=${that.data.wetherKey}`,
              success: function(res) {
                forecast = res.data.HeWeather6[0].daily_forecast;
                that.setData({
                  forecast: forecast,
                });
                console.log('forecast', that.data.forecast);
              },
            });
          }
        })
      },
    });
  }

})
