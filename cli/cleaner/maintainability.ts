import * as ts from 'typescript'

interface HalsteadMetrics {
  n1: number
  n2: number
  N1: number
  N2: number
}

export function computeHalsteadMetrics(fileNames: string[]): HalsteadMetrics {
  let n1Set = new Set<string>()
  let n2Set = new Set<string>()
  let N1 = 0
  let N2 = 0

  fileNames.forEach((fileName) => {
    const sourceFile = ts.createSourceFile(
      fileName,
      ts.sys.readFile(fileName) || '',
      ts.ScriptTarget.Latest,
      true,
    )

    function visit(node: ts.Node) {
      if (ts.isToken(node)) {
        const token = node.getText()
        if (isOperator(token)) {
          n1Set.add(token)
          N1++
        } else if (isOperand(token)) {
          n2Set.add(token)
          N2++
        }
      }
      ts.forEachChild(node, visit)
    }

    visit(sourceFile)
  })

  const n1 = n1Set.size
  const n2 = n2Set.size

  return { n1, n2, N1, N2 }
}

function isOperator(token: string): boolean {
  // Define what you consider as operators
  const operators = new Set([
    '+',
    '-',
    '*',
    '/',
    '%',
    '&&',
    '||',
    '!',
    '==',
    '!=',
    '<',
    '>',
    '>=',
    '<=',
    '=',
    '+=',
    '-=',
    '*=',
    '/=',
    '=>',
    // Add more as needed
  ])
  return operators.has(token)
}

function isOperand(token: string): boolean {
  // Simplified check; in practice, you'd need more robust logic
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(token)
}

export async function computeMaintainabilityIndex(HV: number, CC: number, LOC: number): number {
  const MI = Math.max(
    0,
    ((171 - 5.2 * Math.log(HV) - 0.23 * CC - 16.2 * Math.log(LOC)) * 100) / 171,
  )
  return MI
}