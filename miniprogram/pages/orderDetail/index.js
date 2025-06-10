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

  payOrder() {
    const { order } = this.data
    if (!order) return
    wx.request({
      url: `${baseUrl}/wechat/pay/preorder`,
      method: 'POST',
      data: { orderId: order.id },
      success: res => {
        const params = res.data || {}
        wx.requestPayment({
          timeStamp: params.timeStamp,
          nonceStr: params.nonceStr,
          package: params.package,
          signType: params.signType,
          paySign: params.paySign,
          success: () => {
            wx.showToast({ title: '支付成功' })
            this.fetchOrder(order.id)
          },
          fail: () => {
            wx.showToast({ icon: 'none', title: '支付失败' })
            this.fetchOrder(order.id)
          }
        })
      },
      fail: () => {
        wx.showToast({ icon: 'none', title: '下单失败' })
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
