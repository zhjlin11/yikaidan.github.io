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

  editOrder() {
    const { order } = this.data
    if (!order) return
    wx.navigateTo({
      url: `/pages/editOrder/index?id=${order.id}`
    })
  },

  deleteOrder() {
    const { order } = this.data
    if (!order) return
    wx.showModal({
      title: '删除确认',
      content: '确定要删除该订单吗？',
      success: res => {
        if (res.confirm) {
          wx.request({
            url: `${baseUrl}/orders/${order.id}`,
            method: 'DELETE',
            success: () => {
              wx.redirectTo({
                url: '/pages/orderList/index'
              })
            }
          })
        }
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
