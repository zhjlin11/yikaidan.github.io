const { baseUrl } = require('../../utils/config')

Page({
  data: {
    customers: [],
    editId: null,
    form: { name: '', email: '' }
  },

  onLoad() {
    this.fetchCustomers()
  },

  fetchCustomers() {
    wx.request({
      url: `${baseUrl}/customers`,
      success: res => {
        this.setData({ customers: res.data })
      }
    })
  },

  startEdit(e) {
    const id = e.currentTarget.dataset.id
    const customer = this.data.customers.find(c => c.id === id)
    if (customer) {
      this.setData({ editId: id, form: { name: customer.name, email: customer.email } })
    }
  },

  cancelEdit() {
    this.setData({ editId: null, form: { name: '', email: '' } })
  },

  onName(e) {
    this.setData({ 'form.name': e.detail.value })
  },

  onEmail(e) {
    this.setData({ 'form.email': e.detail.value })
  },

  submitEdit() {
    const { editId, form } = this.data
    wx.request({
      url: `${baseUrl}/customers/${editId}`,
      method: 'PUT',
      data: form,
      success: () => {
        this.setData({ editId: null, form: { name: '', email: '' } })
        this.fetchCustomers()
      }
    })
  },

  deleteCustomer(e) {
    const id = e.currentTarget.dataset.id
    wx.showModal({
      title: '删除确认',
      content: '确定删除该客户吗？',
      success: res => {
        if (res.confirm) {
          wx.request({
            url: `${baseUrl}/customers/${id}`,
            method: 'DELETE',
            success: () => {
              this.fetchCustomers()
            }
          })
        }
      }
    })
  }
})
