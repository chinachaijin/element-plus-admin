<template>
  <div class="app-container" ref="appcontainer">
    <div class="filter-container" ref="filtercontainer">
      <el-input
        v-model="listQuery.username"
        placeholder="备注或功能名"
        style="width: 200px; padding-right: 20px"
        class="filter-item"
        @keyup.enter="handleFilter"
      />
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </el-button>
      <el-button
        v-if="userrights['new']"
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
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
      <el-table-column label="功能ID" align="center">
        <template v-slot="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="功能名" align="center">
        <template v-slot="{ row }">
          <span>{{ row.label }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" align="center">
        <template v-slot="{ row }">
          <span v-for="(role,index) in row.rolesname" :key='index' style='border: 1px solid #DCDFE6;padding: 0px 10px;display: inline-table;margin-left: 5px;'>{{ role }}</span>
        </template>
      </el-table-column>
      <el-table-column label="动作" align="center">
        <template v-slot="{ row }">
          <span v-for="(contset,index) in row.actionname" :key='index' style='border: 1px solid #DCDFE6;padding: 0px 10px;display: inline-table;margin-left: 5px;'>{{ contset }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template v-slot="{ row }">
          <span>{{ row.network }}</span>
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
        <el-form-item label="功能名称" prop="label">
          <el-input v-model="temp.label" />
        </el-form-item>
        <el-form-item label="功能ID名" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item
          v-for="(act, index) in temp.actionname"
          :label="'动作' + index"
          :key="index"
          :prop="'actionname.' + index"
          :rules="{
            required: true, message: '动作不能为空', trigger: 'blur'
          }"
        >
          <el-input v-model="temp.actionname[index]"></el-input><el-button @click.prevent="removeaction(index)">删除</el-button>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="temp.network" />
        </el-form-item>
        <el-form-item label="角色">
          <el-transfer
            filterable
            filter-placeholder="请输入角色名称"
            v-model="temp.roles"
            :data="roledata"
            :titles="['未添加', '已添加']"
            @change="gettransfer">
          </el-transfer>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false"> 关闭 </el-button>
          <el-button @click="addaction"> 添加动作 </el-button>
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
  </div>
</template>

<script>
import {
  getindex,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  rolesadmin
} from '@/api/controllerset'

export default {
  name: 'Apps',
  data() {
    return {
      userrights:this.$store.getters.userrights,
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        username: undefined,
        sort: 'aes'
      },
      tabheight:'500',
      temp: {
        id: undefined,
        name: '',
        label: '',
        network:'',
        actionname:[],
        roles:[],
        rolesname:[]
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '创建'
      },
      rules: {
        name: [
          {
            required: true,
            message: '功能ID不能为空',
            trigger: 'blur'
          }
        ],
        label: [
          {
            required: true,
            message: '功能名不能为空',
            trigger: 'blur'
          }
        ]
      },
      downloadLoading: false,
      roledata:[]
    }
  },
  created() {
    this.getList()
    this.getroledata()
    this.$nextTick(() => {
      this.tabheight = this.$refs.appcontainer.offsetHeight - this.$refs.filtercontainer.offsetHeight - this.$refs.footercontainer.offsetHeight - 20 - 20 - 40
    })
  },
  methods: {
    gettransfer(val) {
      this.temp.rolesname = []
      val.forEach(ele => {
        const index = this.roledata.findIndex(
          (v) => v.key === ele
        )
        if(index >= 0)
        {
          this.temp.rolesname.push(this.roledata[index].label)
        }
      })
    },
    getroledata() {
      rolesadmin().then((res) => {
        this.roledata = []
        res.data.forEach(ele => {
          this.roledata.push({
            key:ele.id,
            label:ele.name,
            disabled:false
          })
        });
      })
    },
    addaction(){
      this.temp.actionname.push('')
    },
    removeaction(index){
      this.temp.actionname.splice(index, 1)
    },
    getList() {
      this.listLoading = true
      getindex(this.listQuery).then((response) => {
        this.list = response.data.controllerset
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
        name: '',
        label: '',
        network:'',
        actionname:[],
        roles:[],
        rolesname:[]
      }
    },
    handleCreate() {
      this.getroledata()
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = 0
          createAdmin(this.temp).then((response) => {
            this.temp.id = response.data
            if(this.listQuery.sort == 'aes')
            {
              this.list.push(this.temp)
            }
            else
            {
              this.list.unshift(this.temp)
            }
            this.dialogFormVisible = false
            this.$store.dispatch('permission/deleteroutes').then( () => {
              this.$store.dispatch('user/getInfo').then((roles) => {
                // 根据角色生成可访问的路由映射
                this.$store.dispatch('permission/generateRoutes', roles.roles)
              })
            })
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.getroledata()
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateAdmin(tempData).then(() => {
            const index = this.list.findIndex(
              (v) => v.id === this.temp.id
            )
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$store.dispatch('permission/deleteroutes').then( () => {
              this.$store.dispatch('user/getInfo').then((roles) => {
                // 根据角色生成可访问的路由映射
                this.$store.dispatch('permission/generateRoutes', roles.roles)
              })
            })
            
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
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
        deleteAdmin(id)
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
    getSortClass: function() {
      const sort = this.listQuery.sort
      return sort === 'asc' ? 'asc' : 'desc'
    }
  }
}
</script>
<style scoped>
.filter-container {
    padding-bottom: 20px;
}
.app-container >>> .el-dialog{
  width: 850px;
  height: 80%;
}
.app-container >>> .el-dialog__body{
  height: inherit;
}
</style>
