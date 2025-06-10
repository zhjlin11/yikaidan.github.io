const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const axios = require('axios');
const xml2js = require('xml2js');
const { Order, Product } = require('../models');
const asyncHandler = require('../utils/asyncHandler');

const wechatConfig = {
  appid: process.env.WECHAT_APPID,
  mchId: process.env.WECHAT_MCHID,
  key: process.env.WECHAT_KEY,
  notifyUrl:
    process.env.WECHAT_NOTIFY_URL || 'https://example.com/wechat/pay/callback',
};

function buildSign(params) {
  const string =
    Object.keys(params)
      .filter((k) => params[k] !== undefined && params[k] !== '')
      .sort()
      .map((k) => `${k}=${params[k]}`)
      .join('&') + `&key=${wechatConfig.key}`;
  return crypto.createHash('md5').update(string, 'utf8').digest('hex').toUpperCase();
}

function buildXML(obj) {
  const builder = new xml2js.Builder({ rootName: 'xml', cdata: true, headless: true });
  return builder.buildObject(obj);
}

// Create a real prepay order via WeChat unified order API
router.post(
  '/pay/preorder',
  asyncHandler(async (req, res) => {
    const { orderId, openid } = req.body;
    const order = await Order.findByPk(orderId, { include: Product });
    if (!order) return res.status(404).json({ error: 'order not found' });

    const nonceStr = crypto.randomBytes(16).toString('hex');
    const totalFee = order.Product
      ? Math.round(Number(order.Product.price) * order.quantity * 100)
      : 1;

    const params = {
      appid: wechatConfig.appid,
      mch_id: wechatConfig.mchId,
      nonce_str: nonceStr,
      body: order.Product ? order.Product.name : `Order ${order.id}`,
      out_trade_no: String(order.id),
      total_fee: totalFee,
      spbill_create_ip: req.ip,
      notify_url: wechatConfig.notifyUrl,
      trade_type: 'JSAPI',
      openid: openid || 'test_openid',
    };
    params.sign = buildSign(params);

    const xml = buildXML(params);
    let result;
    try {
      const response = await axios.post(
        'https://api.mch.weixin.qq.com/pay/unifiedorder',
        xml,
        { headers: { 'Content-Type': 'text/xml' } }
      );
      result = await xml2js.parseStringPromise(response.data, {
        explicitArray: false,
      });
    } catch (err) {
      await order.update({ payStatus: 'failed' }).catch(() => {});
      return res.status(500).json({ error: 'unified order request failed' });
    }

    const data = result.xml || {};
    if (data.return_code !== 'SUCCESS' || data.result_code !== 'SUCCESS') {
      await order.update({ payStatus: 'failed' }).catch(() => {});
      const msg = data.return_msg || data.err_code_des || 'unified order failed';
      return res.status(400).json({ error: msg });
    }

    const prepayId = data.prepay_id;
    await order.update({ prepayId, payStatus: 'prepay' });

    const timeStamp = String(Math.floor(Date.now() / 1000));
    const packageStr = `prepay_id=${prepayId}`;
    const payParams = {
      appId: wechatConfig.appid,
      timeStamp,
      nonceStr,
      package: packageStr,
      signType: 'MD5',
    };
    const paySign = buildSign(payParams);

    res.json({ prepayId, timeStamp, nonceStr, package: packageStr, signType: 'MD5', paySign });
  })
);

// WeChat Pay callback handler
router.post(
  '/pay/callback',
  express.text({ type: /\/xml$/ }),
  asyncHandler(async (req, res) => {
    const raw = req.body;
    let parsed;
    try {
      parsed = await xml2js.parseStringPromise(raw, { explicitArray: false });
    } catch (err) {
      return res.send(buildXML({ return_code: 'FAIL', return_msg: 'XML_PARSE_ERROR' }));
    }
    const data = parsed.xml || {};
    const sign = data.sign;
    delete data.sign;
    const expected = buildSign(data);
    if (sign !== expected) {
      const xmlRes = buildXML({ return_code: 'FAIL', return_msg: 'SIGNERROR' });
      if (req.accepts('json')) return res.status(400).json({ success: false });
      return res.send(xmlRes);
    }

    const order = await Order.findByPk(data.out_trade_no);
    if (!order) {
      const xmlRes = buildXML({ return_code: 'FAIL', return_msg: 'ORDERNOTFOUND' });
      if (req.accepts('json')) return res.status(404).json({ success: false });
      return res.send(xmlRes);
    }

    await order.update({ payStatus: 'paid', status: 'paid' });
    const xmlRes = buildXML({ return_code: 'SUCCESS', return_msg: 'OK' });
    if (req.accepts('json')) return res.json({ success: true });
    res.send(xmlRes);
  })
);

module.exports = router;
