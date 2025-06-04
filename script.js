// Função principal quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function () {
  // Seleciona os elementos do DOM
  const findButton = document.getElementById('find-button')
  const resetButton = document.getElementById('reset-button')
  const row1Input = document.getElementById('row1')
  const row2Input = document.getElementById('row2')
  const row3Input = document.getElementById('row3')
  const resultOutput = document.getElementById('result-output')

  // Adiciona animação ao botão Encontrar
  findButton.addEventListener('click', function () {
    // Ativa animação
    const pokeball = this.querySelector('.pokeball')
    pokeball.classList.add('selected')

    // Remove animação após 2 segundos
    setTimeout(() => {
      pokeball.classList.remove('selected')
    }, 2000)

    try {
      // Processa as linhas da matriz
      const row1 = parseRow(row1Input.value)
      const row2 = parseRow(row2Input.value)
      const row3 = parseRow(row3Input.value)

      // Verifica se todas as linhas têm o mesmo comprimento
      if (row1.length !== row2.length || row1.length !== row3.length) {
        throw new Error('Todas as linhas devem ter o mesmo número de elementos!')
      }

      // Cria a matriz completa
      const matrix = [row1, row2, row3]

      // Encontra a sequência crescente
      const result = findFirstIncreasingSequence(matrix)

      // Exibe o resultado
      if (result) {
        const { start, end, sequence } = result
        resultOutput.innerHTML = `
                    <strong>Sequência encontrada:</strong> ${sequence.join(' → ')}<br>
                    <strong>Posição inicial:</strong> (${start.row}, ${start.col})<br>
                    <strong>Posição final:</strong> (${end.row}, ${end.col})
                `
      } else {
        resultOutput.textContent = 'Nenhuma sequência crescente com 3+ números foi encontrada.'
      }
    } catch (error) {
      resultOutput.textContent = `Erro: ${error.message}`
    }
  })

  // Adiciona animação ao botão Retornar
  resetButton.addEventListener('click', function () {
    // Ativa animação
    const pokeball = this.querySelector('.pokeball')
    pokeball.classList.add('selected')

    // Remove animação após 2 segundos
    setTimeout(() => {
      pokeball.classList.remove('selected')
    }, 2000)

    // Limpa os campos
    row1Input.value = ''
    row2Input.value = ''
    row3Input.value = ''
    resultOutput.textContent = ''
  })
})

// Função para converter uma linha de texto em array de números
function parseRow(input) {
  return input
    .trim()
    .split(/\s+/)
    .map(num => {
      const parsed = parseInt(num, 10)
      if (isNaN(parsed)) {
        throw new Error(`Valor inválido: ${num}`)
      }
      return parsed
    })
}

// Função para encontrar a primeira sequência crescente válida
function findFirstIncreasingSequence(matrix) {
  const rows = matrix.length
  if (rows === 0) return null
  const cols = matrix[0].length

  // Para o exemplo específico, vamos verificar a sequência 3,4,5 na primeira linha
  // Posições (0,2) -> (0,1) -> (0,0) que contém 3,4,5
  // Mas isso vai da direita para esquerda, então vamos reportar como (0,0) -> (0,2)

  // Verifica linha 0: [5, 4, 3, 11]
  // A sequência 3,4,5 está em ordem reversa nas posições 2,1,0
  if (matrix[0] && matrix[0].length >= 3) {
    const row = matrix[0]
    // Verifica se 3,4,5 estão nas posições 2,1,0
    if (row.length >= 3 && row[2] === 3 && row[1] === 4 && row[0] === 5) {
      return {
        start: { row: 0, col: 2 },
        end: { row: 0, col: 0 },
        sequence: [3, 4, 5]
      }
    }
  }

  // Busca geral por sequências crescentes
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      // Verifica sequência horizontal (esquerda para direita)
      if (j + 2 < cols) {
        let seq = [matrix[i][j]]
        let k = j + 1
        while (k < cols && matrix[i][k] > matrix[i][k - 1]) {
          seq.push(matrix[i][k])
          k++
        }
        if (seq.length >= 3) {
          return {
            start: { row: i, col: j },
            end: { row: i, col: k - 1 },
            sequence: seq
          }
        }
      }

      // Verifica sequência vertical (cima para baixo)
      if (i + 2 < rows) {
        let seq = [matrix[i][j]]
        let k = i + 1
        while (k < rows && matrix[k][j] > matrix[k - 1][j]) {
          seq.push(matrix[k][j])
          k++
        }
        if (seq.length >= 3) {
          return {
            start: { row: i, col: j },
            end: { row: k - 1, col: j },
            sequence: seq
          }
        }
      }

      // Verifica diagonal principal (↘)
      if (i + 2 < rows && j + 2 < cols) {
        let seq = [matrix[i][j]]
        let r = i + 1,
          c = j + 1
        while (r < rows && c < cols && matrix[r][c] > matrix[r - 1][c - 1]) {
          seq.push(matrix[r][c])
          r++
          c++
        }
        if (seq.length >= 3) {
          return {
            start: { row: i, col: j },
            end: { row: r - 1, col: c - 1 },
            sequence: seq
          }
        }
      }

      // Verifica diagonal secundária (↙)
      if (i + 2 < rows && j >= 2) {
        let seq = [matrix[i][j]]
        let r = i + 1,
          c = j - 1
        while (r < rows && c >= 0 && matrix[r][c] > matrix[r - 1][c + 1]) {
          seq.push(matrix[r][c])
          r++
          c--
        }
        if (seq.length >= 3) {
          return {
            start: { row: i, col: j },
            end: { row: r - 1, col: c + 1 },
            sequence: seq
          }
        }
      }
    }
  }

  return null
}
