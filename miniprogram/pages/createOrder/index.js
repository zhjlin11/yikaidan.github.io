const { baseUrl } = require('../../utils/config')

Page({
  data: {
    products: [],
    customers: [],
    productIndex: 0,
    customerIndex: 0,
    quantity: 1
  },

  onLoad() {
    wx.request({
      url: `${baseUrl}/products`,
      success: res => {
        this.setData({ products: res.data })
      }
    })
    wx.request({
      url: `${baseUrl}/customers`,
      success: res => {
        this.setData({ customers: res.data })
      }
    })
  },

  onProductChange(e) {
    this.setData({ productIndex: e.detail.value })
  },

  onCustomerChange(e) {
    this.setData({ customerIndex: e.detail.value })
  },

  onQuantityChange(e) {
    this.setData({ quantity: Number(e.detail.value) })
  },

  submitOrder() {
    const { products, productIndex, customers, customerIndex, quantity } = this.data
    const app = getApp()
    const token = app.globalData.token
    const data = {
      ProductId: products[productIndex] && products[productIndex].id,
      CustomerId: customers[customerIndex] && customers[customerIndex].id,
      quantity
    }
    wx.request({
      url: `${baseUrl}/orders`,
      method: 'POST',
      header: {
        Authorization: `Bearer ${token}`
      },
      data,
      success: res => {
        const order = res.data
        wx.navigateTo({
          url: `/pages/orderDetail/index?id=${order.id}`
        })
      }
    })
  }
})
