


<template>
  <div class="app-container">

    <div class="block">

<el-form :inline="true" :model="searchBar" class="demo-form-inline">
<el-form-item label="售后状态">
<el-select v-model.number="searchBar.refund_status" placeholder="售后状态">
<el-option
@change="$forceUpdate()"
v-for="(item, key) in  RefundSatusListData"
:key="key"
:label="item"
:value="key * 1">
</el-option>
</el-select>
</el-form-item>

<el-form-item label="订单号">
<el-input v-model="searchBar.order_id" placeholder="订单号"></el-input>
</el-form-item>

<el-form-item label="售后ID">
<el-input v-model.number="searchBar.refund_id" placeholder="售后ID"></el-input>
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


    <el-table
      :data="listData"
      v-loading="listLoading"
      style="width: 100%">


      <el-table-column prop="order_id" label="售后id">
          <template slot-scope="scope">
              <el-link type="primary"  @click="showDetail(scope.$index)">{{scope.row.refund_id}}</el-link>
        </template>
      </el-table-column>
      
      <el-table-column prop="order_id" label="订单ID">
          <template slot-scope="scope">
            {{scope.row.order_id}}
              <!-- <el-link type="primary"  @click="showDetail(scope.row.order_id)">{{scope.row.order_id}}</el-link> -->
        </template>
      </el-table-column>
      
      <el-table-column prop="refund_status" label="售后状态">
          <template slot-scope="scope">
           {{mappingRefundStatus(scope.row.refund_status)}}
        </template>
      </el-table-column>

      <el-table-column prop="refund_type" label="售后类型">
          <template slot-scope="scope">
              {{mappingRefundType(scope.row.refund_type)}}
        </template>
      </el-table-column>



      <el-table-column prop="refund_count" label="申请数量">
          <template slot-scope="scope">
           {{scope.row.refund_count}}
        </template>
      </el-table-column>
      <el-table-column prop="refund_count" label="申请金额">
          <template slot-scope="scope">
        {{scope.row.refund_money /100}}
        </template>
      </el-table-column>
      <el-table-column prop="refund_fee" label="售后手续费">
          <template slot-scope="scope">
           {{scope.row.refund_fee /100}}
        </template>
      </el-table-column>



      <el-table-column prop="counting_time" label="截止时间">
          <template slot-scope="scope">
        {{dateFormat(scope.row.counting_time)}}
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="申请时间">
          <template slot-scope="scope">
           {{dateFormat(scope.row.create_time)}}
        </template>
      </el-table-column>

      <el-table-column prop="return_reason" label="售后原因">
          <template slot-scope="scope">
             {{scope.row.return_reason}}
        </template>
      </el-table-column>
      
    </el-table>


    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-sizes="[10, 20, 100, 1000]"
      :page-size="10"
      layout="sizes, prev, pager, next"
>
    </el-pagination>


      <!-- order list detail pannel -->
      <el-dialog
      width="90%"
:visible.sync="detailShow"
v-if="detail != null"
>


<el-descriptions class="margin-top" title="售后详情" :column="4" border >
    <template slot="extra">

      总额：
      <b style="color: rgb(243, 5, 5);">￥{{ (detail.refund_money * detail.refund_count) /100 }}</b>
      状态:
      <b style="color: rgb(243, 5, 5);">{{mappingRefundStatus(detail.refund_status) }} </b>
      类型:
      <b style="color: rgb(243, 5, 5);">{{mappingRefundType(detail.refund_type) }} </b>


      <el-button type="primary" size="small" @click="handelStatus(true)">同意</el-button>
      /
      <el-button type="danger" size="small" @click="handelStatus(false)">拒绝</el-button>
    </template>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-user"></i>
        订单单号
      </template>
      {{detail.order_id}}

      
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-user"></i>
        售后id
      </template>
      {{detail.refund_id}}

      
    </el-descriptions-item>

<!-- 
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-mobile-phone"></i>
        {{detail.return_info.product_title}} ({{detail.return_info.product_id}}|{{detail.return_info.brand_name}})
      </template>
      <el-image
      style="width: 100px; height: 100px"
      :src="detail.order_info.product_img"
      :fit="fit"></el-image>
    </el-descriptions-item> -->

    <el-descriptions-item >
      <template slot="label">
        <i class="el-icon-mobile-phone"></i>
        单价
      </template>
    {{detail.refund_money/100}} 
    
    </el-descriptions-item>

    <el-descriptions-item >
      <template slot="label">
        <i class="el-icon-mobile-phone"></i>
        数量:
      </template>
      {{detail.refund_count}} 
    </el-descriptions-item>


    
    <el-descriptions-item >
      <template slot="label">
        <i class="el-icon-mobile-phone"></i>
        创建时间:
      </template>
      {{dateFormat(detail.create_time)}}

    </el-descriptions-item>

        
    <el-descriptions-item >
      <template slot="label">
        <i class="el-icon-mobile-phone"></i>
        截至时间:
      </template>
      {{dateFormat(detail.counting_time)}}

    </el-descriptions-item>


  

    <el-descriptions-item span="3" v-if="detail.return_info" >
      <template slot="label">
        <i class="el-icon-office-building"></i>
        退货寄回信息 仓库地址
      </template>
      {{detail.return_info.recipient_name}}   / {{detail.return_info.address_phone}} / {{detail.return_info.address}} 
    </el-descriptions-item>
    <el-descriptions-item  v-if="detail.return_info" >
      <template slot="label">
        <i class="el-icon-mobile-phone"></i>
        退回快递信息:
      </template>


      <el-link type="primary"  @click="showTrack(detail.return_info.tracking_number ,detail.return_info.carrier  )" >
        {{detail.return_info.carrier }} :{{detail.return_info.tracking_number }}
    </el-link>
    </el-descriptions-item>




    <el-descriptions-item v-if="detail.change_info" span="3">
      <template slot="label">
        <i class="el-icon-office-building"></i>
        换货时收货人信息
      </template>
      {{detail.change_info.recipient_name}}   / {{detail.change_info.address_phone}} / {{detail.change_info.address}} 
    </el-descriptions-item>

    <el-descriptions-item v-if="detail.return_info" >
      <template slot="label">
        <i class="el-icon-mobile-phone"></i>
        换货快递信息:
      </template>


      <el-link type="primary" @click="showTrack(detail.change_info.tracking_number ,detail.change_info.carrier )" >
        {{detail.change_info.carrier }} :{{detail.change_info.tracking_number }}
    </el-link>

    </el-descriptions-item>


    
    <el-descriptions-item span="4">
      <template slot="label">
        <i class="el-icon-user"></i>
        用户上传图片
      </template>
      <el-image
      v-for="(src,index) in detail.refund_img_code" 
      style="width: 100px; height: 100px"
      :src="src"
      ></el-image>
    </el-descriptions-item>


  </el-descriptions>

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
  
  {{showTrack(trackData.tracking_number,trackData.carrier)}}
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


  </div>




</template>


<script>

import { geRefundtList ,mappingRefundType,mappingRefundStatus ,modifyRefundStatus,getTackingDetail,getRefundtList} from '@/api/order'; 
import { dateFormatTable,dateFormat } from '../../utils/tools'; 
import { fenToYuanTable } from '../../utils/tools'; 


export default {
  data() {
    return {
      page_data:{"order_id":"","page":1,"page_size":10},
      currentPage:1,
      listData: null,
      listLoading: false,
      detailShow: false,
      detail:null ,     
       trackingShow:false,
      trackData:null,
      RefundSatusListData :null,
      searchBar: {
        refund_status: -1,
        order_id:null,
        refund_id:null,
        begin_time:null,
        end_time:null
        }

    }
  },
  created() {
    this.fetchData()

  },

  methods: {
    mappingRefundType,
    dateFormat,
    mappingRefundStatus,
    getRefundtList,
    fetchData() {
      this.listLoading = true
      geRefundtList(this.page_data).then(response => {
        this.listData = response.data.list;
        this.listLoading = false
      })
      this.RefundSatusListData = getRefundtList();
    },
    handleSizeChange(val) {
      this.page_data["page_size"] = val;
      this.fetchData() ;
      },
   handleCurrentChange(val) {
        this.page_data["page"] = val;
      this.fetchData() ;
      
   },
    showDetail(index){
          this.listLoading = true
      console.log(index);
      this.detail =this.listData[index];
                  this.listLoading = false;
            this.detailShow = true;
  },
   handelStatus(val){
     const data = {
                    "refund_id": this.detail.refund_id,
                    "agree": val,
                    "reason": "allow"
                  }
                  modifyRefundStatus(data).then(response => {
                    Message({
                           message: response.msg || 'success',
                          type: 'success',
                          duration: 5 * 1000
                        })
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
              this.listData = null;
              geRefundtList(params).then(response => {
                  this.listData = response.data.list;
                  this.listLoading = false

              })


}
          

   }



}

</script>

