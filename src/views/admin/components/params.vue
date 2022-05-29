<template>
  <div :style="isroot ? '':'margin-left: 20px;'" class="margin-tb">
    <div v-for="(item,index) in items" :key="index">
      <div class="el-row margin-tb">
        <div class="el-col el-col-4">
          <el-input
            placeholder="参数名"
            v-model="item.name"
            :disabled="!isedit || (upvaltype == 3 && (item.valtype < 3 || item.valtype == 4))">
          </el-input>
        </div>
        <div class="el-col el-col-4">
          <el-input
            placeholder="描述"
            :disabled="!isedit"
            v-model="item.label">
          </el-input>
        </div>
        <div class="el-col el-col-4">
          <el-input
            placeholder="参数值"
            v-model="item.value"
            :disabled="item.valtype > 1">
          </el-input>
        </div>
        <div class="el-col el-col-3">
          <el-select v-model="item.valtype" placeholder="类型" @change="valtypechange(item)" :disabled="!isedit">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="el-col el-col-5">
          <el-input
            placeholder="备注"
            :disabled="!isedit"
            v-model="item.remarks">
          </el-input>
        </div>
        <div class="el-col el-col-3">
          <i class="el-icon-delete this-padding" @click="items.splice(index,1)" v-if="isedit"></i>
          <i class="el-icon-circle-plus this-padding" v-if="item.valtype > 2 && isedit" @click="item.children.push({name:'',label:'',valtype:0,oldvaltype:0,remarks:'',value:'',children:[]})"></i>
        </div>
      </div>
      <div class="el-row margin-tb" v-if="item.valtype > 2">
        <params :date="item.children" :upvaltype="item.valtype" :isedit="isedit"/>
      </div>
    </div>
    <div v-if="isedit && isroot && upvaltype > 2">
      <el-button @click="items.push({name:'',label:'',valtype:0,oldvaltype:0,remarks:'',value:'',children:[]})"> 添加数据 </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "params",
  props: {
    date: {
      type: Array,
      required: true
    },
    isroot:{
      type: Boolean,
      default:false
    },
    isedit:{
      type: Boolean,
      default:false
    },
    upvaltype:{
      type: Number,
      default:0
    }
  },
  data(){
    return{
      items:this.date,
      options: [{
        value: 0,
        label: '字符'
      }, {
        value: 1,
        label: '数字'
      },{
        value: 3,
        label: '数组'
      }, {
        value: 4,
        label: '对象'
      }]
    }
  },
  watch:{
    date: function(val) {
      this.items = val
    },
    
  },
  methods: {
    valtypechange(item) {
      if(item.valtype > 2)
      {
        if(item.oldvaltype < 3)
        {
          item.children = []
        }
      }
      item.oldvaltype = item.valtype
    }
  }
}
</script>
<style scoped>
.margin-tb{margin-top: 10px;margin-bottom: 10px;}
.this-padding{padding: 10px;}
.el-input{padding:0px 5px;}
</style>
