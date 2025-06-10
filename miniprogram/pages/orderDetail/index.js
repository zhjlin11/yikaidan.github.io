Page({
  data: {
    order: null
  },

  onLoad(options) {
    const id = options.id
    if (id) {
      wx.request({
        url: `http://localhost:3000/orders/${id}`,
        success: res => {
          this.setData({ order: res.data })
        }
      })
    }
  },

  onShareAppMessage() {
    const { order } = this.data
    if (!order) return {}
    return {
      title: '订单支付',
      imageUrl: order.payCode,
      path: `/pages/orderDetail/index?id=${order.id}`
    }
  }
})
