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
      success: res => {
        this.setData({ orders: res.data })
      }
    })
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/orderDetail/index?id=${id}`
    })
  }
})
