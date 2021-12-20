<script setup>
import { ref, onBeforeMount, toRaw, defineEmits } from 'vue'
import { NInputNumber, useDialog } from 'naive-ui'
import Sudoku from '../utils/Sudoku'
import { getBlockCeilKey } from '../utils/index'

const dialog = useDialog()
const sudoku = new Sudoku()
const nums = ref(null)
const diggedNums = ref(null)
const emit = defineEmits(['update:status'])

const initChessBoard = () => {
  nums.value = null
  while (!sudoku.makeDigits()) {
    sudoku.makeDigits()
  }
  nums.value = sudoku.getDigits()
  digBoard()
}

const digBoard = () => {
  sudoku.digHoles()
  nums.value = sudoku.getDigits()
  diggedNums.value = JSON.parse(JSON.stringify(sudoku.getDigits()))
}

const getCeilVal = (arr, blockIdx, ceilIdx) => {
  const [row, col] = getBlockCeilKey(blockIdx, ceilIdx)
  const val = arr[row][col]
  return val === 0 ? null : val
}

const updateNums = (val, blockIdx, ceilIdx) => {
  const [row, col] = getBlockCeilKey(blockIdx, ceilIdx)
  nums.value[row][col] = val || 0
}

const checkResult = () => {
  if (sudoku.checkResult()) {
    dialog.success({
      content: '恭喜你，解答正确！'
    })
  } else {
    dialog.error({
      content: '很遗憾，解答错误！'
    })
  }
}

const clearBoard = () => {
  nums.value = new Array(9).fill(0).map(() => new Array(9).fill(0))
  diggedNums.value = null
  sudoku.clearBoard()
}

const submitInitialBoard = () => {
  sudoku.setDigits(nums.value)
  console.log(nums.value)
  if (sudoku.checkInitialDigits()) { // 初盘合法
    dialog.success({
      content: '恭喜，此初盘合法！'
    })
    diggedNums.value = JSON.parse(JSON.stringify(nums.value))
    emit('update:status', 'new')
  } else {
    dialog.error({
      content: '很遗憾，此初盘不合法！'
    })
  }
}

const showAnswer = () => {
  sudoku.setDigits(nums.value)
  sudoku.checkInitialDigits()
  const answer = sudoku.getAnswer()
  nums.value = answer
  sudoku.setDigits(answer)
}

defineExpose({
  initChessBoard,
  digBoard,
  checkResult,
  clearBoard,
  submitInitialBoard,
  showAnswer
})
</script>

<template>
  <div class="chess-board-container">
    <div class="chess-board__block" v-for="i in 9" :key="i">
      <n-input-number
        class="chess-board__block__cell"
        :class="{
          'chess-board__block__cell--digged':
            diggedNums && !getCeilVal(diggedNums, i, j),
        }"
        v-for="j in 9"
        :key="i + '' + j"
        :min="1"
        :max="9"
        :disabled="diggedNums && Boolean(getCeilVal(diggedNums, i, j))"
        :value="nums && getCeilVal(nums, i, j)"
        @update:value="(val) => updateNums(val, i, j)"
        placeholder=""
        :show-button="false"
      ></n-input-number>
    </div>
  </div>
</template>

<style scoped lang="scss">
.chess-board-container {
  border: 1px solid #344861;
  margin: 100px auto;
  width: 390px;
  height: 390px;
  user-select: none;
  .chess-board__block {
    width: 130px;
    box-sizing: border-box;
    height: 130px;
    float: left;
    border: 1px solid #344861;
    .chess-board__block__cell {
      width: 33.3%;
      height: 33.3%;
      border: 1px solid #c3cbd7;
      float: left;
      box-sizing: border-box;
      vertical-align: middle;
      color: #344861;
      &.chess-board__block__cell--digged {
        :deep(.n-input input) {
          color: #0072e3 !important;
        }
      }
      :deep(.n-input) {
        height: 100%;
        --font-size: 24px !important;
        &.n-input--disabled input {
          color: #333 !important;
        }
      }
    }
  }
}
</style>
