export default function jaccardSimilarity (a: [string], b: [string]): number {
  const intersect: Array<string> = a.filter(c => b.includes(c))
  const union: Array<string> = Array.from(new Set(a.concat(b)))
  return intersect.length / union.length
}
