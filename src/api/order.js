import request from '@/utils/requestprd'

export function getList(data) {
  return request({
    url: '/op/getOrderList',
    method: 'post',
    data
  })
}


export function getDetail(order_id) {
  return request({
    url: '/op/getOrderDetails',
    method: 'post',
    data:{  "order_id": order_id}
  })
}


export function modifyRefundStatus(data){
  return request({
    url: '/op/modifyRefundStatus',
    method: 'post',
    data:data
  })
}

export function getCarrierList(data){
  return request({
    url: '/op/getCarrierList',
    method: 'post',
    data:data
  })
}
export function getTackingDetail(data){
  return request({
    url: '/op/getTackingDetail',
    method: 'post',
    data:data
  })
}
export function shipOrder(data){
  return request({
    url: '/op/shipOrder',
    method: 'post',
    data:data
  })
}

export function sendChange(data){
  return request({
    url: '/op/sendChange',
    method: 'post',
    data:data
  })
}

export function confirmUserReturnCatch(data){
  return request({
    url: '/op/confirmUserReturnCatch',
    method: 'post',
    data:data
  })
}



var OrderSatus  = { "-1":"全部",0:"创建",1:"已支付",  2:"已发货", 3:"已收货",  4:"支付前取消（取消）",  5:"售后中",  6:"售后完结",  7:"已评论"};

export function OrderSatusList(){
  return OrderSatus
}

export function mappingOrderSatus(statusCode){
  // 0创建 1已支付 2已发货 3已收货 4支付前取消（取消） 5售后中 6售后完结 7已评论

  return OrderSatus[statusCode];

}

export function mappingRefundType(statusCode){
  // 0创建 1已支付 2已发货 3已收货 4支付前取消（取消） 5售后中 6售后完结 7已评论

  const data = {0:"仅退款",1:"退货退款",  2:"换货"}
  return data[statusCode];

}

const RefundtList = {
  '-1':"全部",
  0: "已申请",
  1: "申请驳回",
  2: "申请批准",
  3: "售后完结",
  4: "售后取消",
  5: "仅退款 拦截物流中",
  6: "仅退款 拦截物流失败",
  7: "仅退款 拦截物流成功",
  8: "等待寄回",
  9: "收到寄回",
  10: "等待返款",
  11: "换货 已寄出",
  12: "换货 寄出已签收"
}
export function getRefundtList(){

  return RefundtList;
}

export function mappingRefundStatus(statusCode){
  // 0创建 1已支付 2已发货 3已收货 4支付前取消（取消） 5售后中 6售后完结 7已评论

  return RefundtList[statusCode];

}


export function mappingPaymentStatus(statusCode){
  // 0创建 1已支付 2已发货 3已收货 4支付前取消（取消） 5售后中 6售后完结 7已评论
 const data = {
    0: "待支付",
    1: "已支付",
    2: "已取消",
    3: "异常待查",
    4: "已退回"
}
  return data[statusCode];

}

export function mappingPaymentType(statusCode){
  // 0创建 1已支付 2已发货 3已收货 4支付前取消（取消） 5售后中 6售后完结 7已评论
 const data = {
    0: "商品购买"
}
  return data[statusCode];

}


export function geRefundtList(data) {
  return request({
    url: '/op/getRefundList',
    method: 'post',
    data
  })
}
