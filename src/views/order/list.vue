


<template>
  <div class="app-container">

  <div class="block">

      <el-form :inline="true" :model="searchBar" class="demo-form-inline">
  <el-form-item label="订单状态">
    <el-select v-model.number="searchBar.order_status" placeholder="活动区域">
      <el-option
   @change="$forceUpdate()"
      v-for="(item, key) in OrderSatusListData"
      :key="key"
      :label="item"
      :value="key * 1">
    </el-option>
    </el-select>
  </el-form-item>

  <el-form-item label="订单号">
    <el-input v-model="searchBar.order_id" placeholder="订单号"></el-input>
  </el-form-item>
  
  <el-form-item label="商品ID">
    <el-input v-model.number="searchBar.product_id" placeholder="商品ID"></el-input>
  </el-form-item>

    
  <el-form-item label="用户ID">
    <el-input v-model.number="searchBar.user_id" type="number" placeholder="用户ID"></el-input>
  </el-form-item>

    
  <el-form-item label="开始时间">
    <el-date-picker
      v-model="searchBar.begin_time"
      type="datetime"
      value-format="timestamp"
      placeholder="选择开始时间">
    </el-date-picker>
  </el-form-item>

  
    
  <el-form-item label="结束时间">
    <el-date-picker
      v-model="searchBar.end_time"
      type="datetime"
      value-format="timestamp"
      placeholder="选择结束时间">
    </el-date-picker>
  </el-form-item>


  <el-form-item>
    <el-button type="primary" @click="search">查询</el-button>
  </el-form-item>
</el-form>
  </div>

  
  <div class="block">
    <el-table
      :data="orderData"
      v-loading="listLoading"
      style="width: 100%">

      <el-table-column prop="order_status"   label="订单状态"    width="180"      >
          <template slot-scope="scope">
         {{ mappingOrderSatus(scope.row.order_status) }}
        </template>
      </el-table-column>
      <el-table-column prop="order_id" label="订单编号">
          <template slot-scope="scope">
              <el-link type="primary"  @click="showDetail(scope.row.order_id)" >{{scope.row.order_id}}</el-link>
        </template>
      </el-table-column>

      <el-table-column
        prop="product_id"
        label="商品ID"
        width="180">
      </el-table-column>
      <el-table-column
        prop="product_title"
        label="商品名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="item_count"
        label="数量">
      </el-table-column>
      <el-table-column
      :formatter="fenToYuanTable"
        prop="pay_price"
        label="支付价格">
      </el-table-column>
      <el-table-column

        prop="user_id"
        label="用户id">
      </el-table-column>
      <el-table-column
      :formatter="dateFormatTable"
        prop="create_time"
        label="创建时间">
      </el-table-column>
      <!-- <el-table-column
        prop="last_tracking_desc"
        label="物流状态">
      </el-table-column> -->
<!-- 
      <el-table-column prop="last_tracking_time,last_tracking_desc" header-align="center"  label="物流状态">
          <template slot-scope="scope">
              {{ dateFormat(scope.row.last_tracking_time) }}
          =>
              {{ scope.row.last_tracking_desc }}

        </template>
      </el-table-column> -->
    </el-table>


    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-sizes="[10, 50, 100, 1000]"
      :page-size="2"
      layout="sizes, prev, pager, next"
>
    </el-pagination>


      <!-- order list detail pannel -->


<el-dialog
width="90%"
  :visible.sync="detailShow"
  v-if="detail != null"
>




<el-descriptions class="margin-top" title="订单详情" :column="4" wdi  border >
    <template slot="extra">

      总额：
      <b style="color: rgb(243, 5, 5);">￥{{ (detail.order_info.product_price * detail.order_info.item_count ) /100 }}</b>
      状态:
      <b style="color: rgb(243, 5, 5);">{{mappingOrderSatus(detail.order_info.order_status) }} </b>
          
    <el-button type="primary" size="small" @click="showShip()"> 发货/换货</el-button>
    <el-button type="danger" size="small"  @click="confirmReturn()">确认收到寄回</el-button>

    </template>

    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-user"></i>
        订单号
      </template>
      {{detail.order_info.order_id}}
    </el-descriptions-item>

    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-mobile-phone"></i>
        {{detail.order_info.product_title}} ({{detail.order_info.product_id}}|{{detail.order_info.brand_name}})
      </template>
      <el-image
      style="width: 100px; height: 100px"
      :src="detail.order_info.product_img"
></el-image>
    </el-descriptions-item>

    <el-descriptions-item >
      <template slot="label">
        <i class="el-icon-mobile-phone"></i>
        单价
      </template>
    {{detail.order_info.product_price/100}} 
    
    </el-descriptions-item>

    <el-descriptions-item >
      <template slot="label">
        <i class="el-icon-mobile-phone"></i>
        数量:
      </template>
      {{detail.order_info.item_count}} 
    </el-descriptions-item>




  

    <el-descriptions-item span="3">
      <template slot="label">
        <i class="el-icon-office-building"></i>
        收货信息
      </template>
      {{detail.order_info.address_info.recipient_name}}   / {{detail.order_info.address_info.address_phone}} / {{detail.order_info.address_info.address}} 
    </el-descriptions-item>


    <el-descriptions-item> 
      <template slot="label">
        <i class="el-icon-office-building"></i>
        快递单号
      </template>
      <el-link type="primary" @click="showTrack(detail.order_info.address_info.tracking_number,detail.order_info.address_info.carrier)" 
      > {{detail.order_info.address_info.carrier}} ：{{detail.order_info.address_info.tracking_number}} 

      </el-link>
    </el-descriptions-item>



    <el-descriptions-item  span="3">
      <template slot="label">
        <i class="el-icon-mobile-phone"></i>
        最后一次物流状态
      </template>
     {{detail.order_info.last_tracking_desc}} 
    </el-descriptions-item>

    <el-descriptions-item >
      <template slot="label">
        <i class="el-icon-mobile-phone"></i>
        最后一次物流时间
      </template>
        {{dateFormat(detail.order_info.last_tracking_time)}} 
    </el-descriptions-item>
  </el-descriptions>


  <h2>订单变更记录</h2>
  <el-timeline>
    <el-timeline-item
      v-for="(activity, index) in detail.order_change"
      :key="index"
      :timestamp="dateFormat(activity.change_time)">
      {{mappingOrderSatus(activity.order_status)}}
    </el-timeline-item>
  </el-timeline>

  <el-descriptions class="margin-top" title="订单售后记录" :column="4"  border>
    <template slot="extra">
      <!-- <el-button type="primary" size="small">操作</el-button> -->
      <span>{{ mappingRefundStatus(detail.order_refund.refund_status) }} </span>
    </template>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-user"></i>
        售后ID
      </template>
      {{detail.order_refund.refund_id}}
    </el-descriptions-item>


    
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-user"></i>
        售后申请时间
      </template>
      {{dateFormat(detail.order_refund.create_time)}}
    </el-descriptions-item>

    
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-user"></i>
        售后截止时间
      </template>
      {{dateFormat(detail.order_refund.create_time)}}
    </el-descriptions-item>
    
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-user"></i>
        申请数量
      </template>
      {{detail.order_refund.refund_count}}
    </el-descriptions-item>
    
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-user"></i>
        申请金额
      </template>
      {{detail.order_refund.refund_money/100}}
    </el-descriptions-item>
    
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-user"></i>
        售后手续费
      </template>
      {{detail.order_refund.refund_fee/100}}
    </el-descriptions-item>


    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-user"></i>
        售后原因
      </template>
      {{detail.order_refund.return_reason}}
    </el-descriptions-item>

    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-user"></i>
        售后类型 
      </template>
      {{mappingRefundType(detail.order_refund.refund_type)}}
    </el-descriptions-item>



    <el-descriptions-item span="3">
      <template slot="label">
        <i class="el-icon-user"></i>
        退货寄回信息
      </template>
      {{detail.order_refund.return_info.recipient_name}}   |    {{detail.order_refund.return_info.address_phone}} | {{detail.order_refund.return_info.address}}
    </el-descriptions-item>

    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-user"></i>
        退回快递
      </template>
      <el-link type="primary" @click="showTrack(detail.order_refund.return_info.tracking_number,detail.order_refund.return_info.carrier)" >
        {{detail.order_refund.return_info.carrier}} :       {{detail.order_refund.return_info.tracking_number}} 
      </el-link>

    </el-descriptions-item>


    <el-descriptions-item span="3">
      <template slot="label">
        <i class="el-icon-user"></i>
        换货时收货人信息
      </template>
      {{detail.order_refund.change_info.recipient_name}}   |    {{detail.order_refund.change_info.address_phone}} | {{detail.order_refund.change_info.address}}
    </el-descriptions-item>

    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-user"></i>
        换货时快递
      </template>
      <el-link type="primary" @click="showTrack(detail.order_refund.change_info.tracking_number,detail.order_refund.change_info.carrier)" >
      {{detail.order_refund.change_info.carrier}} :       {{detail.order_refund.change_info.tracking_number}} 
    </el-link>
    </el-descriptions-item>


    <el-descriptions-item span="4">
      <template slot="label">
        <i class="el-icon-user"></i>
        用户上传图片
      </template>
      <el-image
      v-for="(src,index) in detail.order_refund.refund_img_code" 
      style="width: 100px; height: 100px"
      :src="src"
      ></el-image>
    </el-descriptions-item>

  </el-descriptions>


  
  <h2>售后变更记录</h2>
  <el-timeline>
    <el-timeline-item
      v-for="(activity, index) in detail.refund_change"
      :key="index"
      :timestamp="dateFormat(activity.change_time)">
      {{mappingRefundStatus(activity.refund_status)}}
    </el-timeline-item>
  </el-timeline>
    


    <el-descriptions class="margin-top" title="支付信息" :column="4"  border v-if="detail != null">

    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-user"></i>
        记录ID
      </template>
      {{detail.payment_info.payment_id}}
    </el-descriptions-item>

    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-user"></i>
        支付时间
      </template>
      {{dateFormat(detail.payment_info.payment_time)}}
    </el-descriptions-item>

    
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-user"></i>
        实际支付金额
      </template>
      {{detail.payment_info.payment_amount /100}}
    </el-descriptions-item>

    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-user"></i>
        平台优惠 
      </template>
      {{detail.payment_info.payment_discount /100}}
    </el-descriptions-item>

    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-user"></i>
        平台流水号 
      </template>
      {{detail.payment_info.payment_third_no}}
    </el-descriptions-item>

    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-user"></i>
        支付方式 
      </template>
      {{detail.payment_info.payment_method}}
    </el-descriptions-item>

    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-user"></i>
        支付状态  
      </template>
      {{mappingPaymentStatus(detail.payment_info.payment_result)}}
    </el-descriptions-item>


    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-user"></i>
      	支付退回时间
      </template>
      {{dateFormat(detail.payment_info.payment_return_time)}}
    </el-descriptions-item>

    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-user"></i>
      	支付方式
      </template>
      {{mappingPaymentType(detail.payment_info.payment_type)}}
    </el-descriptions-item>


    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-user"></i>
        交易流水号
      </template>
      {{detail.payment_info.transaction_id}}
    </el-descriptions-item>

  </el-descriptions>
<!-- 
  <span slot="footer" class="dialog-footer">
    <el-button @click="detailShow = false">取 消</el-button>
    <el-button type="primary" @click="detailShow = false">确 定</el-button>
  </span> -->
</el-dialog>


<el-dialog
  width="90%"
  :visible.sync="trackingShow"
  v-if="trackData != null"
>
<el-descriptions class="margin-top" title="物流信息" :column="2"  >

  <h2> <b>{{trackData.is_done==true?'已签收':'未签收'}}</b></h2>
  <el-descriptions-item>
  <template slot="label">
    <i class="el-icon-user"></i>
    承运商
  </template>
  {{trackData.carrier}}
</el-descriptions-item>


<el-descriptions-item>
  <template slot="label">
    <i class="el-icon-user"></i>
    物流号
  </template>
  {{trackData.tracking_number}}
</el-descriptions-item>

</el-descriptions>

<el-timeline>
    <el-timeline-item
      v-for="(activity, index) in trackData.logistics_details"
      :key="index"
      :timestamp="dateFormat(activity.tracking_time)">
      {{activity.tracking_area_name}}|{{activity.tracking_status}} --- {{activity.tracking_text}}
    </el-timeline-item>
  </el-timeline>
    
</el-dialog>



<el-dialog
  width="90%"
  :visible.sync="shipShow"
  v-if="shipShow != null"
>

发货类型：
<el-select  v-model="shipTypeValue"  placeholder="请选择" >
    <el-option
      v-for="item in shipType"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>


 快递公司:
    <el-select v-loadmore="loadmore" v-model="carrierCode" filterable     placeholder="选择快递公司">
        <el-option

          v-for="item in carrierCodeList"
          :key="item.carrier_code"
          :label="item.carrier_name"
          :value="item.carrier_code">
        </el-option>
      </el-select>
      快递号:
      <el-input style="width:20%"  v-model="trackingNumber" placeholder="输出快递号" clearable></el-input>

        <el-button type="primary" size="medium " @click="toShip()">发货</el-button>

</el-dialog>

  </div>


</div>

</template>


<script>

import { getList,getDetail,mappingOrderSatus ,mappingRefundType,mappingRefundStatus,mappingPaymentStatus,mappingPaymentType,modifyRefundStatus,getTackingDetail,getCarrierList,shipOrder,confirmUserReturnCatch,sendChange,OrderSatusList,getRefundtList} from '@/api/order'; 
import { dateFormatTable,dateFormat } from '../../utils/tools'; 
import { fenToYuanTable } from '../../utils/tools'; 


export default {
  data() {
    return {
      page_data:{"order_status":-1,"page":1,"page_size":10},
      currentPage:1,
      orderData: null,
      listLoading: false,
      detailShow: false,
      detail:null,
      trackingShow:false,
      trackData:null,
      shipShow:false,
      shipTypeValue:0,
      shipType:[{value:0,label:'发货'},{value:1,label:'发出换货'}],
      carrierCode:null,
      carrierPage :{"page": 1,  "page_size": 30 },
      carrierCodeList :[],
      loadMoreintercept:false,
      trackingNumber:"",
      OrderSatusListData :null,
      searchBar: {
        order_status: -1,
        order_id:null,
        user_id:null,
        product_id:null,
        begin_time:null,
        end_time:null

        }
    }
  },
  created() {
    this.fetchData()

  },

  methods: {
    fetchData() {
      this.listLoading = true
      this.OrderSatusListData = OrderSatusList();
      console.log(  this.OrderSatusListData);
      getList(this.page_data).then(response => {
        this.orderData = response.data.list;
        this.listLoading = false
        getCarrierList(this.carrierPage).then(response => {
          this.carrierCodeList = response.data.list;
        })

        
      })
      this.OrderSatusList = getRefundtList();

    },
    dateFormatTable,
    dateFormat,
    fenToYuanTable,
    mappingOrderSatus,
    mappingRefundType,
    mappingRefundStatus,
    mappingPaymentStatus,
    mappingPaymentType,
    modifyRefundStatus,
    getCarrierList,
    shipOrder,
    OrderSatusList,
    getRefundtList,
    handleSizeChange(val) {
      this.page_data["page_size"] = val;
      this.fetchData() ;
      },
    handleCurrentChange(val) {
        this.page_data["page"] = val;
      this.fetchData() ;
      },
    showDetail(order_id){
          this.listLoading = true
          getDetail(order_id).then(response => {
            this.listLoading = false;
            this.detailShow = true;
            console.log("get detail ===>" ,response);
            this.detail = response.data;

          });
   },
   showTrack(tracking_number,carrier){

        var data =  {
        "tracking_number": tracking_number,
        "carrier": carrier,
      }

        getTackingDetail(data).then(response => {
            this.trackingShow = true;
            this.trackData = response.data;
            
          });
   },
   showShip(){
    this.shipShow = !this.shipShow;
    this.loadMoreintercept = false;
    this.trackingNumber = "";

   },
   loadmore(){
    // 如果 intercept 属性为 true 则不请求数据
    if (this.loadMoreintercept) {
          return 
      }
      this.loadMoreintercept= true
      this.carrierPage.page = this.carrierPage.page+1;
      console.log( this.carrierPage.page);
     // 请求后端数据并加入分页
  
     getCarrierList(this.carrierPage).then(response => {
      this.carrierCodeList =       this.carrierCodeList.concat(response.data.list);
            this.loadMoreintercept = false
            
          });
    }
    ,toShip(){
      if(    this.trackingNumber=="")
      {
        shipOrder(data).then(response => {
            Message({
            message: '快递号不能为空',
            type: 'error',
            duration: 5 * 1000
          })
      });
     }
      if(this.shipTypeValue==0){  // 发货
      const data = {
          "carrier": this.carrierCode,
          "tracking_number": this.trackingNumber,
          "order_id":this.detail.order_info.order_id
        }
        shipOrder(data).then(response => {
            Message({
            message: response.msg || 'success',
            type: 'success',
            duration: 5 * 1000
          })
        });



      }else    if(this.shipTypeValue==1){ // 换货
        const data =          {
          "refund_id":this.detail.order_refund.refund_id,
          "carrier": this.carrierCode,
          "tracking_number": this.trackingNumber,
        }
        sendChange(data).then(response => {

          this.$message({
          message: response.msg,
          type: 'success'
        });
       
        });
        

      }
            
    }
    ,
      confirmReturn()
      {
        const data =          {
          "refund_id":this.detail.order_refund.refund_id,
        }
        confirmUserReturnCatch(data).then(response => {
              this.$message({
              message: response.msg,
              type: 'success'
            });
        });
      }
      ,
      search(){

        const params =  { ...this.page_data, ...this.searchBar };
        console.log( params);
        
        if(params.begin_time>params.end_time)
        {
          this.$message.error('结束不能大于开始时间');
       
          return
        }
        params.begin_time = parseInt(params.begin_time / 1000);
        params.end_time = parseInt(params.end_time / 1000);
        this.orderData = null;
        getList(params).then(response => {
        this.orderData = response.data.list;
        this.listLoading = false


        
      })
      

      }
  }// end methond

}

</script>

