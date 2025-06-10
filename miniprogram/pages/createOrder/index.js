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
      url: 'http://localhost:3000/products',
      success: res => {
        this.setData({ products: res.data })
      }
    })
    wx.request({
      url: 'http://localhost:3000/customers',
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
    const data = {
      productId: products[productIndex] && products[productIndex].id,
      customerId: customers[customerIndex] && customers[customerIndex].id,
      quantity
    }
    wx.request({
      url: 'http://localhost:3000/orders',
      method: 'POST',
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
