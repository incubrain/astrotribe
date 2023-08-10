export default function (input) {
  const bigIntHandled = JSON.stringify(
    input,
    (key, value) => (typeof value === 'bigint' ? value.toString() : value) // return everything else unchanged
  )
  return JSON.parse(bigIntHandled)
}
