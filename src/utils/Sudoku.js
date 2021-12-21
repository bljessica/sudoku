import { getBlockCeilKey } from './index'

export default class Sudoku {

	constructor() {
		this.digits = this.blankMatrix(9);
    this.digTimes = 2
    this.stack = []
    this.flag = false;
    this.answer = null
	}

  clearBoard() {
    this.stack = []
    this.flag = false;
  }

	blankMatrix(size) {
		let newMatrix = [];
		for (let i = 0;i < size;i ++) {
			newMatrix.push([]);
		}
		return newMatrix;
	}

  setDigits(digits) {
    this.digits = digits
  }

  //检测初盘合法性
  checkInitialDigits() {
    const problem = JSON.parse(JSON.stringify(this.digits))
    for(let i = 0; i<9; i++){
      for(let j = 0; j<9; ){
          if(problem[i][j] === 0 || this.flag){
            this.flag = false;
              let k = problem[i][j] + 1;
              while(k<10){
                problem[i][j] = k;
                  if(this.check20Grid(problem,i,j) == 0){
                      this.stack.push([i,j++])
                      break;
                  }
                  k++;
              }
              if(k>9){
                  problem[i][j] = 0;
                  let rt = this.stack.pop();
                  if(!rt)
                      return 0;
                  i=rt[0]
                  j=rt[1]
                  this.flag = true;
              }
          }else{
              j++;
          }
      }
    }
    this.answer = problem
    return 1;
  }

  getAnswer () {
    return this.answer
  }

  check20Grid(sudo,i,j) {
    let row = {}, col = {}, subSudo = {}
    for(let k = 0; k < 9; k++){
        let cur1 = sudo[i][k], cur2 = sudo[k][j]
        if(row[cur1])
            return 1;
        else
            row[cur1] = cur1
        if(col[cur2])
            return 2;
        else
            col[cur2] = cur2;
        let key = sudo[Math.floor(i/3)*3 + Math.floor(k/3)][Math.floor(j/3)*3+Math.floor(k%3)]
        if(subSudo[key])
            return 3
        else
            subSudo[key] = key
    }
    return 0;
  }

	makeDigits() {
		let colLists = this.blankMatrix(9);
		let areaLists = this.blankMatrix(3);
		let nine = this.randNine();
		let i = 0,
			j = 0,
			areaIndex = 0,
			count = 0,
			error = false,
			first = 0;
		for (i = 0;i < 9;i ++) {
			colLists[i].push(nine[i]);
		}
		areaLists[0] = nine.slice(0, 3);
		areaLists[1] = nine.slice(3, 6);
		areaLists[2] = nine.slice(6);

		for (i = 0;i < 8;i ++) {
			nine = this.randNine();
			if (i % 3 == 2) {
				areaLists = this.blankMatrix(3);
			}

			for (j = 0;j < 9;j ++) {
				areaIndex = Math.floor(j / 3);
				count = 0;
				error = false;
				while (colLists[j].includes(nine[0]) || areaLists[areaIndex].includes(nine[0])) {
					if (++count >= nine.length) {
						error = true;
						break;
					}
					nine.push(nine.shift());
				}
				if (error) 
          return false
				first = nine.shift();
				colLists[j].push(first);
				areaLists[areaIndex].push(first);
			}
		}
		this.digits = colLists;
    return true
	}

  getDigits() {
    return this.digits
  }

  setDigits(digits) {
    this.digits = digits
  }

  checkResult() {
    const board = this.digits
    //   检查每一行
    for (let arr of board) {            
      let row = []
      for (let c of arr) {
        if (c !== 0) row.push(c);
      }
      let set = new Set(row)
      if (set.size !== 9) return false;
    }
  
    //   检查每一列
    for (let i = 0; i < 9; i++) {
      let col = []
      board.map( arr => {
        if (arr[i] !== 0) col.push(arr[i])
      })
      let set = new Set(col)
      if (set.size !== 9) return false;
    }
  
    //   检查每个小方块
    for (let x = 0; x < 9; x += 3) {
      for (let y = 0; y < 9; y += 3) {
        let box = []
        for (let a = x; a < 3 + x; a ++) {
          for (let b = y; b < 3 + y; b ++) {
            if (board[a][b] !== 0) box.push(board[a][b])
          }
        }
        let set = new Set(box)
        if (set.size !== 9) return false
      }
    }
    
    return true
  }

  digHoles() {
    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++) {
            // 在每个block中挖几个洞
            for( let k = 0; k < this.digTimes; k++) {
                let randIdx = Math.floor(Math.random() * 9 + 1);
                const blockIdx = i * 3 + j + 1
                let [row, col] = getBlockCeilKey(blockIdx, randIdx)
                while (this.digits[row][col] === 0) {
                  randIdx = Math.floor(Math.random() * 9 + 1);
                  [row, col] = getBlockCeilKey(blockIdx, randIdx)
                }
                this.digits[row][col] = 0
            }
        }
    }
  }

	randNine() {
		const nine = this.nine();
		let index = 0;

		for (let i = 0;i < 5;i ++) {
			index = this.randIndex();
			[nine[0], nine[index]] = [nine[index], nine[0]];
		}

		return nine;
	}

	nine() {
		return [1, 2, 3, 4, 5, 6, 7, 8, 9];
	}

	randIndex() {
		return Math.floor(Math.random() * 9);
	}
}
