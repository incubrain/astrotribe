import { jscpd } from 'jscpd'

export async function detectDuplicateCode() {
  const jscpd = new Jscpd({
    path: ['src'], // Paths to scan
    languages: ['typescript'],
    reporters: [], // We'll handle reporting ourselves
  })

  const result = await jscpd.detect()

  result.clones.forEach((clone) => {
    console.log('Duplicate code found:')
    console.log(
      `- File A: ${clone.duplicationA.sourceId} [Lines ${clone.duplicationA.start.line}-${clone.duplicationA.end.line}]`,
    )
    console.log(
      `- File B: ${clone.duplicationB.sourceId} [Lines ${clone.duplicationB.start.line}-${clone.duplicationB.end.line}]`,
    )
  })
}
