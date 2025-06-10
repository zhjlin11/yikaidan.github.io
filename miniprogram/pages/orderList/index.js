const { baseUrl } = require('../../utils/config')

Page({
  data: {
    orders: []
  },

  onLoad() {
    this.fetchOrders()
  },

  fetchOrders() {
    wx.request({
      url: `${baseUrl}/orders`,
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
  },

  editOrder(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/editOrder/index?id=${id}`
    })
  },

  deleteOrder(e) {
    const id = e.currentTarget.dataset.id
    wx.showModal({
      title: '删除确认',
      content: '确定要删除该订单吗？',
      success: res => {
        if (res.confirm) {
          wx.request({
            url: `${baseUrl}/orders/${id}`,
            method: 'DELETE',
            success: () => {
              this.fetchOrders()
            }
          })
        }
      }
    })
  }
})
