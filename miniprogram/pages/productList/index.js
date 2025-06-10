const { baseUrl } = require('../../utils/config')

Page({
  data: {
    products: [],
    editId: null,
    form: { name: '', price: '' }
  },

  onLoad() {
    this.fetchProducts()
  },

  fetchProducts() {
    wx.request({
      url: `${baseUrl}/products`,
      success: res => {
        this.setData({ products: res.data })
      }
    })
  },

  startEdit(e) {
    const id = e.currentTarget.dataset.id
    const product = this.data.products.find(p => p.id === id)
    if (product) {
      this.setData({ editId: id, form: { name: product.name, price: product.price } })
    }
  },

  cancelEdit() {
    this.setData({ editId: null, form: { name: '', price: '' } })
  },

  onName(e) {
    this.setData({ 'form.name': e.detail.value })
  },

  onPrice(e) {
    this.setData({ 'form.price': e.detail.value })
  },

  submitEdit() {
    const { editId, form } = this.data
    wx.request({
      url: `${baseUrl}/products/${editId}`,
      method: 'PUT',
      data: form,
      success: () => {
        this.setData({ editId: null, form: { name: '', price: '' } })
        this.fetchProducts()
      }
    })
  },

  deleteProduct(e) {
    const id = e.currentTarget.dataset.id
    wx.showModal({
      title: '删除确认',
      content: '确定删除该商品吗？',
      success: res => {
        if (res.confirm) {
          wx.request({
            url: `${baseUrl}/products/${id}`,
            method: 'DELETE',
            success: () => {
              this.fetchProducts()
            }
          })
        }
      }
    })
  }
})
