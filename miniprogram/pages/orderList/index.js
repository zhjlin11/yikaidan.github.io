Page({
  data: {
    orders: []
  },

  onLoad() {
    this.fetchOrders()
  },

  fetchOrders() {
    wx.request({
      url: 'http://localhost:3000/orders',
      method: 'GET',
      success: (res) => {
        this.setData({ orders: res.data })
      },
      fail: () => {
        wx.showToast({ title: '加载失败', icon: 'none' })
      }
    })
  }
})
