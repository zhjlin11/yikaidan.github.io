const { baseUrl } = require('../../utils/config')

Page({
  data: {
    order: null
  },

  onLoad(options) {
    const { id } = options
    if (id) {
      this.fetchOrder(id)
    }
  },

  fetchOrder(id) {
    wx.request({
      url: `${baseUrl}/orders/${id}`,
      success: res => {
        this.setData({ order: res.data })
      }
    })
  },

  onShareAppMessage() {
    const { order } = this.data
    if (!order) return {}
    return {
      title: `订单 ${order.id}`,
      path: `/pages/orderDetail/index?id=${order.id}`,
      imageUrl: order.seal || ''
    }
  }
})
