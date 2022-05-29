<template>
  <div class="app-container">
    <div class="demo-input-suffix">
      基础配置
    </div>
    <div class="demo-input-suffix">
      <el-form
        label-position="left"
        label-width="80px"
        style="min-width: 740px; margin-left: 50px;overflow: overlay;height: 100%;"
      >
        <el-form-item :label="temp.label" prop="value" v-for="temp in list" :key="temp.id" label-width="200px">
          <params :date="temp.jsonval" :isroot="true" :isedit="false" v-if="temp.istype > 2 && temp.istype < 10" :upvaltype="temp.istype"></params>
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
            :before-upload="beforeAvatarUpload"
            :on-change="(data) => {requesthomeimg(data,temp)}">
            <img v-if="temp.value.length > 0" :src="temp.value[0].url" class="avatar"/>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
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
            :on-change="(data) => {requesthomeimg(data,temp)}"
            :on-preview="handleimgPictureCardPreview"
            >
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
              :on-change="(data) => {requesthomeimg(data,temp)}">
              <el-button size="small" type="primary">点击上传</el-button>
              <template #tip>
                <div class="el-upload__tip">只能上传rar/zip文件</div>
              </template>
            </el-upload>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="dialog-footer">
      <el-button
        v-if="userrights['setvalue']"
        type="primary"
        @click="updateData()"
      >
        保存
      </el-button>
    </div>
    <el-dialog v-model="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import {
  getindexall,
  setconfigs,
  uploadimgset,
  uploadfileset
} from '@/api/config'
import { host } from '@/utils/validate'
import Params from './components/params.vue'
export default {
  name: 'Config',
  data() {
    return {
      userrights:this.$store.getters.userrights,
      imghost:host,
      list: [],
      dialogVisible:false,
      dialogImageUrl:''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getindexall().then((response) => {
        response.data.config.forEach(item => {
          if(item.istype > 9 && item.istype <20) {
            let imgs = []
            let val = eval(item.value)
            if(!Array.isArray(val)) {
              val = []
              item.value = []
            }
            
            val.forEach((item) => {
              if(typeof item == 'string' && item != '')
                imgs.push({name:item.split('/').pop(),url: this.imghost + item,id:item.id})
            })
            item.value = imgs
          } else if(item.istype > 2 && item.istype < 9) {
            item.value = eval(item.value)
          }
        })
        this.list = response.data.config
      })
    },
    updateData() {
      const tempData = JSON.parse(JSON.stringify(this.list))
      let files = []
      let imgs = []
      tempData.forEach((item,itemindex) => {
        if(item.istype > 2 && item.istype < 10) {
          item.value = JSON.stringify(this.inputtojson(item.jsonval,item.istype))
        } else if(item.istype == 10 || item.istype == 11) {
          let img = []
          let newvalue = []
          for (let index = 0; index < item.value.length; index++) {
            if(item.value[index].url.indexOf('blob') == -1)
            {
              img.push({num:index,id:item.id,url:item.value[index].url})
              newvalue.push(item.value[index].url.replace(this.imghost,''))
            }else{
              img.push({num:index,id:item.id,file:this.list[itemindex].value[index].file,url:item.value[index].url})
              newvalue.push('')
            }
          }
          item.value = newvalue
          if(img.length > 0) {
            imgs.push(img)
          }
        } else if(item.istype == 12 || item.istype == 13) {
          let file = []
          let newvalue = []
          for (let index = 0; index < item.value.length; index++) {
            console.log(index)
            if(item.value[index].url != undefined)
            {
              file.push({num:index,id:item.id,url:item.value[index].url,name:item.value[index].name})
              newvalue.push(item.value[index].url.replace(this.imghost,''))
            }else{
              file.push({num:index,id:item.id,raw:this.list[itemindex].value[index].raw,url:item.value[index].url,name:item.value[index].name})
              newvalue.push('')
            }
          }
          item.value = newvalue
          if(file.length > 0) {
            files.push(file)
          }
        }
      })
      setconfigs({'config':tempData}).then(() => {
        imgs.forEach(item => {
          this.uploadimgs(0,item,item[0].id)
        })
        files.forEach(item => {
          this.uploadfiles(0,item,item[0].id)
        })
      })
    },
    uploadimgs(i,data,id) {
      if(i < data.length)
      {
        if(data[i].url.indexOf('blob') > -1) {
          uploadimgset(data[i]).then((res)=>{
            data[i] = {name:res.data.split('/').pop(),url: this.imghost + res.data}
            i++
            this.uploadimgs(i,data,id)
          }).catch(err=>{
            console.log(err.message)
            this.uploadimgs(i,data,id)
          })
        } else {
          i++
          this.uploadimgs(i,data,id)
        }
      } else {
        let index = this.list.findIndex(
          (v) => v.id == id
        )
        this.list[index].value = data
      }
    },
    uploadfiles(i,data,id) {
      if(i < data.length)
      {
        if(data[i].url == undefined) {
          uploadfileset(data[i]).then((res)=>{
            data[i] = {name:res.data.split('/').pop(),url: this.imghost + res.data}
            i++
            this.uploadfiles(i,data,id)
          }).catch(err=>{
            console.log(err.message)
            this.uploadfiles(i,data,id)
          })
        } else {
          i++
          this.uploadfiles(i,data,id)
        }
      } else {
        let index = this.list.findIndex(
          (v) => v.id == id
        )
        this.list[index].value = data
      }
    },
    handleimgRemove(file,temp) {
      temp.value = temp.value.filter((item) => {
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
    requesthomeimg(date,temp) {
      if(temp.istype == 10) {
        temp.value = [{uid:date.uid,num:0,file:date.raw,url:URL.createObjectURL(date.raw)}]
      } else if(temp.istype == 11) {
        let index = temp.value.findIndex((item) => item.uid === date.uid)
        temp.value.splice(index,1,{uid:date.uid,file:date.raw,url:date.url})
      } else {
        let index = temp.value.findIndex((item) => item.uid === date.uid)
        temp.value.splice(index,1,{raw:date.raw,id:date.uid,name:date.name})
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
      return this.$confirm(`确定移除 ${ file.name }？`).then(() => true).catch( () => false)
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
.app-container {
  padding-top: 40px;
  text-align: center;
}
.app-container >>> .el-dialog{
  width: 850px;
}
.app-container >>> .el-dialog__body{
  height: inherit;
}
.demo-input-suffix {
  margin: 20px;
  margin-left: 0px;
}
.dialog-footer {
  margin-top: 30px;
}
</style>
