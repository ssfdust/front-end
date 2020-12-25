<template>
  <div id="app">
    <el-container>
      <el-main>
        <el-header style="text-align: left; font-size: 16px">
          <h2>CCTV告警汇总操作面板</h2>
        </el-header>
        <el-table :data="tableData" ref="dragTable" style="width:800px" fit highlight-current-row class="tb-edit" row-key="id">
          <el-table-column label="字段名" prop="label" width="180"></el-table-column>
          <el-table-column label="是否展示" width="180">
            <template scope="scope">
                <el-select v-model="scope.row.state" placeholder="请输入内容">
                  <el-option
                    v-for="item in yesorno"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作" width="180">
            <template scope="scope">
              <el-select v-model="scope.row.action" placeholder="请输入内容">
                <el-option
                  v-for="item in scope.row.actions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="内容" width="250">
            <template scope="scope">
              <el-input
                v-if="scope.row.is_str"
                :disabled="scope.row.action?false:true"
                v-model="scope.row.content"
                placeholder="请输入内容">
              </el-input>
              <el-date-picker
                :disabled="scope.row.action?false:true"
                v-model="scope.row.content"
                v-if="scope.row.is_time"
                type="datetime"
                placeholder="选择时间">
              </el-date-picker>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer style="width:800px;align:right">
        <el-row>
          <el-button type="danger" @click="submit">提交</el-button>
          <el-button type="primary" @click="resetCurrentState" plain>完全重置</el-button>
        </el-row>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
  import Sortable from 'sortablejs'
  import axios from 'axios'
  const txt_actions = [
    {label: "", value: ""},
    {label: "包含", value: "contains"},
  ]
  const eq_actions = [
    {label: "", value: ""},
    {label: "等于", value: "eq"},
  ]
  const complex_actions = [
    {value: '', label: ''},
    {value: 'eq', label: '等于'},
    {value: 'ne', label: '不等于'},
    {value: 'gt', label: '大于'},
    {value: 'lt', label: '小于'},
    {value: 'gte', label: '大于等于'},
    {value: 'lte', label: '小于等于'},
  ]
  var defaultData = [
          {
            id: 1,
            label: "告警等级",
            key: "level",
            action: "",
            actions: eq_actions,
            state: true,
            is_str: true,
            is_time: false,
            content: ""
          },
          {
            id: 2,
            label: "首次告警时间",
            key: "first",
            action: "",
            actions: complex_actions,
            state: true,
            is_str: false,
            is_time: true,
            content: ""
          },
          {
            id: 3,
            label: "最后告警时间",
            key: "last",
            action: "",
            actions: complex_actions,
            state: true,
            is_str: false,
            is_time: true,
            content: ""
          },
          {
            id: 4,
            label: "告警内容",
            key: "content",
            action: "",
            state: true,
            actions: txt_actions,
            is_str: true,
            is_time: false,
            content: ""
          },
          {
            id: 5,
            label: "告警次数",
            key: "count",
            action: "",
            actions: complex_actions,
            state: true,
            is_str: true,
            is_time: false,
            content: ""
          },
          {
            id: 6,
            label: "告警设备",
            key: "name",
            action: "",
            actions: txt_actions,
            state: true,
            is_str: true,
            is_time: false,
            content: ""
          },
          {
            id: 7,
            label: "地址",
            key: "ip",
            action: "",
            actions: txt_actions,
            state: true,
            is_str: true,
            is_time: false,
            content: ""
          },
          {
            id: 8,
            label: "业务系统",
            key: "module",
            action: "",
            actions: txt_actions,
            state: true,
            is_str: true,
            is_time: false,
            content: ""
          },
          {
            id: 9,
            label: "告警状态",
            key: "status",
            action: "",
            actions: txt_actions,
            state: true,
            is_str: true,
            is_time: false,
            content: ""
          },
        ]
  export default {
    data(){
      return {
        tableData: [
        ],
        yesorno: [
          {label: "是", value: true},
          {label: "否", value: false}
        ],
        actions: [
        ]
      }
    },
    mounted() {
      this.getCurrentState()
      this.setSort()
    },
    methods: {
      setSort: function() {
        const el = this.$refs.dragTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
        this.sortable = Sortable.create(el, {
          ghostClass:'sortable-ghost',
          setData: function(dataTransfer) {
            dataTransfer.setData('Text', '')
          }, 
          onEnd: evt => {
            const targetRow = this.tableData.splice(evt.oldIndex, 1)[0];
            this.tableData.splice(evt.newIndex, 0, targetRow);
          },
        })
      },
      submit: function() {
        axios.post('/column-settings', this.buildState())
        .then(() => {
          this.$message({
            message: '修改成功.',
            type: 'success'
          });
        })
        .catch(() => {
          this.$message({
            message: '修改失败.',
            type: 'error'
          });
        })
      },
      buildState: function() {
        var build = []
        for (var i = 0;i < this.tableData.length;i++){
          this.tableData[i].id = i + 1
        }
        this.tableData.forEach(element => {
          build.push({
            id: element.id,
            name: element.key,
            state: element.state,
            action: element.action,
            content: element.content
          })
        })
        return build
      },
      resetCurrentState: function() {
        this.tableData = []
        defaultData.forEach(element => {
          var copied_element = {}
          Object.assign(copied_element, element)
          this.tableData.push(copied_element)
        })
      },
      getCurrentState: function() {
        var columns = []
        var self = this
        axios.get('/column-settings')
        .then(function ({data}) {
          // handle success
          self.tableData = []
          columns = data.data
          columns.forEach(col => {
            defaultData.forEach(element => {
              if (col.name == element.key) {
                var copied_element = {}
                Object.assign(copied_element, element)
                copied_element.id = col.id
                copied_element.state = col.state
                copied_element.action = col.action
                copied_element.content = col.content
                self.tableData.push(copied_element)
              }
            })
          })
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
      }
    }
  }
</script>
