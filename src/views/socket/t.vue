<template>
  <div id="app">
    <div id="nav">
      <button @click="connect">连接socket</button>
      <button @click="sendMessage">发送数据</button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {

    }
  },
  computed: {
    ...mapGetters([
      'account',
      'avatar'
    ])
  },
  created() {
    this.join()
    this.subscribeAll()
  },
  mounted() {
    console.log(11111, this.avatar)
    this.sockets.subscribe('joinNoticeOther', data => {
      console.log(888888888888888888)
      console.log('welcome data ', data)
    })
  },
  methods: {
    // 连接socket
    connect() {
      this.$socket.open() // 开始连接socket
      // 仅在组件内订阅事件
      this.sockets.subscribe('joinNoticeOther', data => {
        console.log('welcome data ', data)
      })
      this.$socket.emit('join', { name: this.account })
    },

    // 发送消息
    sendMessage() {
      this.$socket.emit('join', { name: 'zzc' })
    },
    join() {
      console.log(23131232)
      this.$socket.emit('join', { name: this.account })
    },
    subscribeAll() {
      console.log(1111)

      this.$socket.on('joinNoticeSelf', (data) => {
        console.log(data, 123123)
      })
    }

  },

  sockets: {
  // 链接成功
    // join() {
    //   this.$socket.emit('join', { name: 'zzc' })
    // },
    connect(data) {
      console.log(data)
    },
    // 发送消息
    toServer(data) {
      this.$socket.emit('toServer', data)
    },
    // 接收消息
    toClient(data) {
      this.msgList.push(data)
    },
    // 断开链接回调
    disconnect() {
      console.log('disconnect：', '已经断开 socket 链接')
    },
    // 重新连接
    reconnect() {
    // 自动执行，直到链接成功
      this.$socket.emit('connect')
    }
  }
}
</script>
