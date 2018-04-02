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
    console.log('app test', app.testTest);
  },

  bindGetWeather: function() {
    let latitude, longitude, city, district, now, forecast;
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        latitude = res.latitude;
        longitude = res.longitude;
      },
      complete: () => {
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude,
          },
          success: (res) => {
            city = res.result.address_component.city;
            district = res.result.address_component.district;
            this.setData({
              latitude: latitude,
              longitude: longitude,
              city: city,
              district: district,
            });
          },
          complete: () => {
            wx.request({
              url: `${this.data.nowUrl}${city}&key=${this.data.wetherKey}`,
              success: (res) => {
                now = res.data.HeWeather6[0].now;
                this.setData({
                  now: now,
                });
                console.log('this', this.data.now);
              },
            });
            wx.request({
              url: `${this.data.futureUrl}${city}&key=${this.data.wetherKey}`,
              success: (res) => {
                forecast = res.data.HeWeather6[0].daily_forecast;
                this.setData({
                  forecast: forecast,
                });
                console.log('forecast', this.data.forecast);
              },
            });
          }
        })
      },
    });
  }

})
