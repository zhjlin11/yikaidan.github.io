Page({
  data: {
    form: {
      customer: '',
      product: '',
      quantity: 1,
      amount: ''
    }
  },

  onLoad() {},

  onInput(e) {
    const field = e.currentTarget.dataset.field
    this.setData({
      [`form.${field}`]: e.detail.value
    })
  },

  onSubmit() {
    const data = this.data.form
    wx.request({
      url: 'http://localhost:3000/orders',
      method: 'POST',
      data,
      success: () => {
        wx.showToast({ title: '订单创建成功' })
        this.setData({
          form: { customer: '', product: '', quantity: 1, amount: '' }
        })
      },
      fail: () => {
        wx.showToast({ title: '创建失败', icon: 'none' })
      }
    })
  }
})
