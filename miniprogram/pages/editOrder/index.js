const { baseUrl } = require('../../utils/config')

Page({
  data: {
    products: [],
    customers: [],
    productIndex: 0,
    customerIndex: 0,
    quantity: 1,
    orderId: null,
  },

  onLoad(options) {
    const { id } = options
    if (id) {
      this.setData({ orderId: id })
      this.loadOrder(id)
    }
  },

  loadOrder(id) {
    wx.request({
      url: `${baseUrl}/orders/${id}`,
      success: res => {
        const order = res.data
        this.setData({ quantity: order.quantity })
        this.loadLists(order)
      }
    })
  },

  loadLists(order) {
    wx.request({
      url: `${baseUrl}/products`,
      success: res => {
        const products = res.data
        const productId = order.Product ? order.Product.id : order.productId
        const productIndex = products.findIndex(p => p.id === productId)
        this.setData({
          products,
          productIndex: productIndex >= 0 ? productIndex : 0
        })
      }
    })
    wx.request({
      url: `${baseUrl}/customers`,
      success: res => {
        const customers = res.data
        const customerId = order.Customer ? order.Customer.id : order.customerId
        const customerIndex = customers.findIndex(c => c.id === customerId)
        this.setData({
          customers,
          customerIndex: customerIndex >= 0 ? customerIndex : 0
        })
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
    const { orderId, products, productIndex, customers, customerIndex, quantity } = this.data
    const data = {
      productId: products[productIndex] && products[productIndex].id,
      customerId: customers[customerIndex] && customers[customerIndex].id,
      quantity
    }
    wx.request({
      url: `${baseUrl}/orders/${orderId}`,
      method: 'PUT',
      data,
      success: res => {
        const order = res.data
        wx.redirectTo({
          url: `/pages/orderDetail/index?id=${order.id}`
        })
      }
    })
  }
})
