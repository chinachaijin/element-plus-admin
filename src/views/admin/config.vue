<template>
  <div class="app-container" ref="appcontainer">
    <div class="filter-container" ref="filtercontainer">
      <el-input
        v-model="listQuery.name"
        placeholder="昵称或用户名"
        style="width: 200px; padding-right: 20px"
        class="filter-item"
        @keyup.enter="handleFilter"
      />
      <el-button
        class="filter-item"
        type="primary"
        icon="Search"
        @click="handleFilter"
      >
        搜索
      </el-button>
      <el-button
        v-if="userrights['new']"
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="Edit"
        @click="handleCreate"
      >
        添加
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      :max-height="tabheight"
      @sort-change="sortChange"
    >
      <el-table-column
        label="ID"
        prop="id"
        sortable="custom"
        align="center"
        width="80"
        :class-name="getSortClass()"
      >
        <template v-slot="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="唯一ID" align="center">
        <template v-slot="{ row }">
          <span>{{ row.key }}</span>
        </template>
      </el-table-column>
      <el-table-column label="显示名称" align="center">
        <template v-slot="{ row }">
          <span>{{ row.label }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户可见" class-name="status-col" width="100" v-if="userrights['issystem']">
        <template v-slot="{ row }">
          <span class="el-tag  el-tag--medium el-tag--light" :class="'el-tag--' + issystemFilter(row.issystem)" @click="handleModifyStatus(row, row.issystem)">{{ issystemName(row.issystem) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数据类型" align="center">
        <template v-slot="{ row }">
          <span>{{ configtypeName(row.istype) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="值" align="center">
        <template v-slot="{ row }">
          <span>{{ row.value }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="300"
        class-name="small-padding fixed-width"
      >
        <template v-slot="{ row, $index }">
          <el-button
            v-if="userrights['edit']"
            type="primary"
            size="small"
            @click="handleUpdate(row)"
          >
            编辑
          </el-button>
          <el-button
            v-if="userrights['del']"
            size="small"
            type="danger"
            @click="handleDelete(row, $index)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div ref="footercontainer" class="el-pagination-top">
      <el-pagination layout="total, sizes, prev, pager, next" :page-sizes="[10, 20, 50, 100]" background :hide-on-single-page="total <= 0" :total="total" v-model:current-page="listQuery.page" v-model:page-size="listQuery.limit" @size-change="getList"  @current-change="getList"/>
    </div>

    <el-dialog
      :title="textMap[dialogStatus]"
      v-model="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="80px"
        style="min-width: 740px; margin-left: 50px;overflow: overlay;height: 100%;"
      >
        <el-form-item label="唯一名称" prop="key">
          <el-input v-model="temp.key" />
        </el-form-item>
        <el-form-item label="显示名称" prop="label">
          <el-input v-model="temp.label" />
        </el-form-item>
        <el-form-item label="用户可见" v-if="userrights['issystem']">
          <el-switch
            active-text="可见"
            inactive-text="隐藏"
            v-model="temp.issystem"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
        <el-form-item label="数据类型">
          <el-select
            v-model="temp.istype"
            size="large"
            filterable
            remote
            clearable
            reserve-keyword
            placeholder="数据类型"
            :loading="usersloading"
            @change="configtypechange"
            style="width: 200px; padding-right: 20px">
            <el-option
              v-for="item in configtype"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="值" prop="value">
          <params :date="temp.jsonval" :isroot="true" :isedit="true" v-if="temp.istype > 2 && temp.istype < 10" :upvaltype="temp.istype"></params>
          <el-input v-model="temp.value" v-if="temp.istype == 1" type="number"/>
          <el-input v-model="temp.value" v-if="temp.istype == 0"/>
          <el-switch
            v-if="temp.istype == 2"
            active-text="启用"
            inactive-text="禁用"
            active-value="1"
            inactive-value="0"
            v-model="temp.value"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
          <el-upload
            v-if="temp.istype == 10"
            action="#"
            class="avatar-uploader"
            :show-file-list="false"
            :auto-upload="false"
            :before-upload="beforeAvatarUpload"
            :on-change="requesthomeimg">
            <img v-if="temp.value.length > 0" :src="temp.value[0].url" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
          <el-upload
            v-if="temp.istype == 11"
            action="#"
            list-type="picture-card"
            :limit="10"
            :multiple="true"
            :file-list="temp.value"
            :auto-upload="false"
            :on-exceed="handleExceed"
            :on-change="requesthomeimg"
            :on-preview="handleimgPictureCardPreview"
            :on-remove="handleimgRemove">
              <el-icon><Plus /></el-icon>
          </el-upload>
          <div style="max-width: 300px;    width: -webkit-fill-available;" v-if="temp.istype == 12">
            <el-upload
              class="upload-demo"
              action="#"
              :before-remove="beforeRemove"
              multiple
              :limit="3"
              :on-exceed="handleExceed"
              :file-list="temp.value"
              :auto-upload="false"
              :on-preview="handlePreview"
              :on-change="requesthomeimg">
              <el-button size="small" type="primary">点击上传</el-button>
              <template #tip>
                <div class="el-upload__tip">只能上传rar/zip文件</div>
              </template>
            </el-upload>
          </div>
          
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false"> 关闭 </el-button>
          <el-button
            type="primary"
            @click="
              dialogStatus === 'create' ? createData() : updateData()
            "
          >
            保存
          </el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>

  </div>
</template>

<script>
import {
  getindex,
  create,
  update,
  destroy,
  issystem,
  uploadimg,
  uploadfile
} from '@/api/config'
import { host } from '@/utils/validate'
import Params from './components/params.vue'

export default {
  name: 'Config',
  data() {
    return {
      userrights:this.$store.getters.userrights,
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: '',
        sort: 'aes'
      },
      tabheight:'500',
      temp: {
        id: undefined,
        key: '',
        label: '',
        value:'',
        jsonval:[],
        issystem:false,
        istype:0
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '创建'
      },
      rules: {
        key: [
          {
            required: true,
            message: '唯一ID不能为空',
            trigger: 'blur'
          }
        ],
        label: [
          {
            required: true,
            message: '显示名称不能为空',
            trigger: 'blur'
          }
        ],
        value: [
          {
            required: true,
            message: '值不能为空',
            trigger: 'blur'
          }
        ]
      },
      configtype:[],
      usersloading:false,
      dialogVisible:false,
      dialogImageUrl:'',
      imghost:host,
    }
  },
  created() {
    this.getList()
    this.$nextTick(() => {
      this.tabheight = this.$refs.appcontainer.offsetHeight - this.$refs.filtercontainer.offsetHeight - this.$refs.footercontainer.offsetHeight - 20 - 20 - 40
    })
  },
  methods: {
    issystemFilter(issystem) {
      return !issystem ? 'danger' : 'success'
    },
    issystemName(issystem) {
      return !issystem ? '隐藏' : '可见'
    },
    configtypeName(configtype) {
      let index = this.configtype.findIndex(item => {
        return item.id == configtype ? true :false
      })
      if(index >= 0)
        return this.configtype[index].name
      else
        return ''
    },
    getList() {
      this.listLoading = true
      getindex(this.listQuery).then((response) => {
        this.list = response.data.config
        this.configtype = response.data.configtype
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = 'asc'
      } else {
        this.listQuery.sort = 'desc'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        key: '',
        label: '',
        value:'',
        jsonval:[],
        issystem:false,
        istype:0
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      let temp = JSON.parse(JSON.stringify(this.temp))
      if(temp.istype > 2 && temp.istype < 10) {
        temp.value = JSON.stringify(this.inputtojson(temp.jsonval,temp.istype))
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          temp.id = 0
          let imgs = []
          if(temp.istype >= 10 && temp.istype <= 20) {
            imgs = Object.assign([], this.temp.value)
            temp.value = []
          }
          create(temp).then((response) => {
            let index = 0
            temp.id = response.data
            if(this.listQuery.sort == 'aes')
            {
              this.list.push(temp)
              index = this.list.length - 1
            }
            else
            {
              this.list.unshift(temp)
            }
            if(temp.istype == 11 || temp.istype == 10) {
              this.uploadimgs(0,imgs,false,index,temp)
            } else if(temp.istype == 12 || temp.istype == 13) {
              this.uploadfiles(0,imgs,false,index,temp)
            } else {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            }
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      if(this.temp.istype >= 10 && this.temp.istype <= 20) {
        let imgs = []
        let val = eval(this.temp.value)
        if(!Array.isArray(val)) {
          val = []
          this.temp.value = []
        }
        
        val.forEach((item) => {
          if(typeof item == 'string' && item != '')
            imgs.push({name:item.split('/').pop(),url: this.imghost + item,id:item.id})
        })
        this.temp.value = imgs
      }

      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      let temp = JSON.parse(JSON.stringify(this.temp))
      if(temp.istype > 2 && temp.istype < 10) {
        temp.value = JSON.stringify(this.inputtojson(temp.jsonval,temp.istype))
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let imgs = []
          if(temp.istype == 10 || temp.istype == 11) {
            imgs = Object.assign([], this.temp.value)
            for (let index = 0; index < temp.value.length; index++) {
              if(temp.value[index].url.indexOf('blob') > -1)
              {
                temp.value[index] = ''
              }else{
                temp.value[index] = temp.value[index].url.replace(this.imghost,'')
              }
              imgs[index].num = index
            }
          } else if(temp.istype == 12 || temp.istype == 13) {
            imgs = Object.assign([], this.temp.value)
            for (let index = 0; index < temp.value.length; index++) {
              if(temp.value[index].url != undefined)
              {
                temp.value[index] = temp.value[index].url.replace(this.imghost,'')
              }else{
                temp.value[index] = ''
              }
              imgs[index].num = index
            }
          }
          update(temp).then(() => {
            const index = this.list.findIndex(
              (v) => v.id === temp.id
            )
            if(temp.istype == 10 || temp.istype == 11) {
              this.uploadimgs(0,imgs,true,index,temp)
            } else if(temp.istype == 12 || temp.istype == 13) {
              this.uploadfiles(0,imgs,true,index,temp)
            } else {
              this.list.splice(index, 1, temp)
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
            }
          })
        }
      })
    },
    handleDelete(row, index) {
      const id = {
        id: row.id
      }
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        destroy(id)
          .then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.list.splice(index, 1)
          })
          .catch(() => {
            this.$notify({
              title: '失败',
              message: '删除失败',
              type: 'danger',
              duration: 2000
            })
          })
      })
    },
    handleModifyStatus(row, status) {
      const date = {
        id: row.id
      }
      issystem(date)
        .then(() => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          row.issystem = !status
        })
        .catch(() => {
          this.$message({
            message: '操作失败',
            type: 'danger'
          })
        })
    },
    uploadimgs(i,data,isedit,index,temp) {
      if(i < data.length)
      {
        if(data[i].url.indexOf('blob') > -1) {
          data[i].id = temp.id
          uploadimg(data[i]).then((res)=>{
            temp.value[data[i].num] = res.data
            i++
            this.uploadimgs(i,data,isedit,index,temp)
          }).catch(err=>{
            console.log(err.message)
            this.uploadimgs(i,data,isedit,index,temp)
          })
        } else {
          i++
          this.uploadimgs(i,data,isedit,index,temp)
        }
      } else {
        temp.value = JSON.stringify(temp.value)
        if(isedit) {
          this.list.splice(index, 1, temp)
          this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 2000
          })
        } else {
          this.list.splice(index, 1, temp)
          this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 2000
          })
        }
      }
    },
    uploadfiles(i,data,isedit,index,temp) {
      if(i < data.length)
      {
        if(data[i].url == undefined) {
          data[i].id = temp.id
          uploadfile(data[i]).then((res)=>{
            temp.value[i] = res.data
            i++
            this.uploadfiles(i,data,isedit,index,temp)
          }).catch(err=>{
            console.log(err.message)
            this.uploadfiles(i,data,isedit,index,temp)
          })
        } else {
          i++
          this.uploadfiles(i,data,isedit,index,temp)
        }
      } else {
        temp.value = JSON.stringify(temp.value)
        if(isedit) {
          this.list.splice(index, 1, temp)
          this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 2000
          })
        } else {
          this.list.splice(index, 0, temp)
          this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 2000
          })
        }
        this.resetTemp()
      }
    },
    handleimgRemove(file) {
      this.temp.value = this.temp.value.filter((item) => {
        return item.uid != file.uid
      })
    },
    handleimgPictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    getSortClass: function() {
      const sort = this.listQuery.sort
      return sort === 'asc' ? 'asc' : 'desc'
    },
    configtypechange: function() {
      if(this.temp.istype == 10 || this.temp.istype == 11) {
        if(!Array.isArray(this.temp.value)) {
          this.temp.value = []
        }
      }
      if(this.temp.istype == 0 || this.temp.istype == 1) {
        if(typeof this.temp.value == 'object') {
          this.temp.value = ''
        }
      }

      if(this.temp.istype == 12 || this.temp.istype == 13) {
        if(!Array.isArray(this.temp.value)) {
          this.temp.value = []
        }
      }
    },
    // 配置转json
    inputtojson(date, valtype) {
      let json = (valtype == 4 ? {} : [])
      date.forEach(item => {
        if(valtype == 4)
        {
          json[item.name] = item.valtype == 1 ? Number(item.value): (item.valtype == 0 ? item.value: (item.valtype == 2 ? "这是文件": this.inputtojson(item.children,item.valtype)))
        }
        else if(valtype == 3)
        {
          json.push(item.valtype == 1 ? Number(item.value): (item.valtype == 0 ? item.value: (item.valtype == 2 ? "这是文件": this.inputtojson(item.children,item.valtype))))
        }
        else
        {
          console.log("error:item=1 or item=0。类型出现等于数字和文本的类型")
          console.log(valtype)
        }
      })
      return json
    },
    // json转配置
    jsontoinput(date) {
      let isarr = Array.isArray(date)
      let json = []
      if(isarr) {
        date.forEach(item => {
          json.push({name:'',label:'',valtype:3,oldvaltype:3,remarks:'',value:'',children:this.jsontoinput(item)})
        })
      }
      else if(typeof date == "object") {
        let objjson = []
        Object.keys(date).forEach(item => {
          if(Array.isArray(date[item])) {
            date[item].forEach(item1 => {
              objjson.push({name:'',label:'',valtype:3,oldvaltype:3,remarks:'',value:'',children:this.jsontoinput(item1)})
            })
          }
          else if(typeof date[item] == "object") {
            objjson.push({name:item,label:'',valtype:4,oldvaltype:4,remarks:'',value:'',children:this.jsontoinput(date[item])})
          }

          if(typeof date[item] == "number") {
            objjson.push({name:item,label:'',valtype:0,oldvaltype:0,remarks:'',value:date[item],children:[]})
          }

          if(typeof date[item] == "string") {
            objjson.push({name:item,label:'',valtype:1,oldvaltype:1,remarks:'',value:date[item],children:[]})
          }
        })
        json.push({name:'',label:'',valtype:4,oldvaltype:4,remarks:'',value:date,children:objjson})
      }

      if(typeof date == "number") {
        json.push({name:'',label:'',valtype:0,oldvaltype:0,remarks:'',value:date,children:[]})
      }

      if(typeof date == "string") {
        json.push({name:'',label:'',valtype:1,oldvaltype:1,remarks:'',value:date,children:[]})
      }

      return json
    },
    requesthomeimg(date) {
      if(this.temp.istype == 10) {
        this.temp.value = [{uid:date.uid,num:0,file:date.raw,url:URL.createObjectURL(date.raw)}]
      } else if(this.temp.istype == 11) {
        let index = this.temp.value.findIndex((item) => item.uid === date.uid)
        this.temp.value.splice(index,1,{uid:date.uid,file:date.raw,url:date.url})
      } else {
        let index = this.temp.value.findIndex((item) => item.uid === date.uid)
        this.temp.value.splice(index,1,{raw:date.raw,id:date.uid,name:date.name})
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/gif' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;
      
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 10 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file) {
      
      return this.$confirm(
        `确定移除 ${file.name} ?`,
        {
          "button-size":'small'
        }
      ).then(
        () => true,
        () => false
      )
    },
    handlePreview(file) {
      if(file.url) {
        window.location.href = file.url
      } else if(file.raw != undefined) {
        const a= document.createElement("a")
        a.href = URL.createObjectURL(file.raw)
        a.download = file.name // 这里填保存成的文件名
        a.click()
        URL.revokeObjectURL(a.href)
        a.remove()
      } else {
        this.$notify({
          title: '失败',
          message: '下载失败',
          type: 'danger',
          duration: 2000
        })
      }
    }
  },
  components:{
    Params
  }
}
</script>
<style scoped>
.filter-container {
    padding-bottom: 20px;
}
.app-container >>> .el-dialog{
  width: 850px;
}
.app-container >>> .el-dialog__body{
  height: inherit;
}
.app-container >>> .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.app-container >>> .avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.app-container >>> .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.app-container >>> .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
