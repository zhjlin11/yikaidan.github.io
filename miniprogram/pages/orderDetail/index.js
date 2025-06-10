Page({
  data: {
    orderId: null,
    order: null
  },

  onLoad(options) {
    const id = options.id;
    if (id) {
      this.setData({ orderId: id });
      this.fetchOrder();
    }
  },

  fetchOrder() {
    wx.request({
      url: `http://localhost:3000/orders/${this.data.orderId}`,
      method: 'GET',
      success: (res) => {
        this.setData({ order: res.data });
      }
    });
  },

  onQuantityChange(e) {
    this.setData({ 'order.quantity': e.detail.value });
  },

  onStatusChange(e) {
    this.setData({ 'order.status': e.detail.value });
  },

  updateOrder() {
    wx.request({
      url: `http://localhost:3000/orders/${this.data.orderId}`,
      method: 'PUT',
      data: {
        quantity: this.data.order.quantity,
        status: this.data.order.status
      },
      success: (res) => {
        this.setData({ order: res.data });
        wx.showToast({ title: 'Updated', icon: 'success' });
      }
    });
  },

  deleteOrder() {
    wx.request({
      url: `http://localhost:3000/orders/${this.data.orderId}`,
      method: 'DELETE',
      success: () => {
        wx.showToast({ title: 'Deleted', icon: 'success' });
        wx.navigateBack();
      }
    });
  }
});
