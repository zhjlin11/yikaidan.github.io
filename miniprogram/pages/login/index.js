const { baseUrl } = require('../../utils/config')

Page({
  data: {
    username: '',
    password: ''
  },
  onUsername(e) {
    this.setData({ username: e.detail.value })
  },
  onPassword(e) {
    this.setData({ password: e.detail.value })
  },
  login() {
    const { username, password } = this.data
    wx.request({
      url: `${baseUrl}/auth/login`,
      method: 'POST',
      data: { username, password },
      success: res => {
        if (res.data.token) {
          const app = getApp()
          app.globalData.token = res.data.token
          wx.setStorageSync('token', res.data.token)
          wx.showToast({ title: '登录成功' })
          wx.navigateBack()
        } else {
          wx.showToast({ icon: 'none', title: '登录失败' })
        }
      },
      fail: () => {
        wx.showToast({ icon: 'none', title: '登录失败' })
      }
    })
  }
})
