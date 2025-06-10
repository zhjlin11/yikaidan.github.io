const BASE_URL = 'http://localhost:3000';

Page({
  data: {
    customerId: '',
    startDate: '',
    endDate: '',
    orders: []
  },

  onLoad() {
    this.fetchOrders();
  },

  onCustomerInput(e) {
    this.setData({ customerId: e.detail.value });
  },

  onStartDateChange(e) {
    this.setData({ startDate: e.detail.value });
  },

  onEndDateChange(e) {
    this.setData({ endDate: e.detail.value });
  },

  fetchOrders() {
    const { customerId, startDate, endDate } = this.data;
    const params = [];
    if (customerId) params.push(`customerId=${customerId}`);
    if (startDate) params.push(`startDate=${startDate}`);
    if (endDate) params.push(`endDate=${endDate}`);
    const query = params.join('&');

    wx.request({
      url: `${BASE_URL}/orders${query ? `?${query}` : ''}`,
      success: res => {
        this.setData({ orders: res.data });
      }
    });
  }
});
