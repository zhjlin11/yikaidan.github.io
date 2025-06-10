Page({
  data: {},
  onLoad() {},
  async createAndPay() {
    const createRes = await new Promise((resolve, reject) => {
      wx.request({
        url: 'http://localhost:3000/orders',
        method: 'POST',
        data: { quantity: 1 },
        success: resolve,
        fail: reject
      });
    });
    const order = createRes.data;

    const preRes = await new Promise((resolve, reject) => {
      wx.request({
        url: 'http://localhost:3000/wechat/pay/preorder',
        method: 'POST',
        data: { orderId: order.id },
        success: resolve,
        fail: reject
      });
    });
    const payData = preRes.data;

    wx.requestPayment({
      timeStamp: payData.timeStamp,
      nonceStr: payData.nonceStr,
      package: 'prepay_id=' + payData.prepayId,
      signType: 'MD5',
      paySign: payData.paySign,
      success() {
        wx.showToast({ title: 'paid' });
      },
      fail() {
        wx.showToast({ title: 'pay fail', icon: 'none' });
      }
    });
  }
});
