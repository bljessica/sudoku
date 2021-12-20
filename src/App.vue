<script setup>
import ChessBoard from './components/ChessBoard.vue'
import { NButton, NDialogProvider } from 'naive-ui'
import { ref } from 'vue'

const status = ref(null)
const chessBoard = ref(null)

const initNewGame = () => {
  chessBoard.value.initChessBoard()
  status.value = 'new'
}

const customNewGame = () => {
  chessBoard.value.clearBoard()
  status.value = 'custom'
}

const backToSelect = () => {
  status.value = null
  chessBoard.value.clearBoard()
}

</script>

<template>
  <n-dialog-provider>
    <div class="action-btns-wrapper">
      <n-button @click="initNewGame" v-if="!status">新游戏</n-button>
      <n-button @click="customNewGame" v-if="!status">自定义初盘</n-button>
      <n-button @click="chessBoard.checkResult()" v-if="status === 'new'"
        >提交结果</n-button
      >
      <n-button
        @click="chessBoard.submitInitialBoard()"
        v-if="status === 'custom'"
      >
        提交自定义初盘
      </n-button>
      <n-button v-if="status === 'custom'" @click="chessBoard.clearBoard()"
        >清空</n-button
      >
      <n-button v-if="status" @click="backToSelect">返回主页</n-button>
      <n-button @click="chessBoard.showAnswer()" v-if="status === 'new'"
        >显示答案</n-button
      >
    </div>
    <ChessBoard ref="chessBoard" @update:status="status = $event" />
  </n-dialog-provider>
</template>

<style scoped lang="scss">
#app {
  text-align: center;
  width: 100vw;
  height: 100vh;
  .action-btns-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 390px;
    margin: 100px auto -50px;
  }
}
</style>
