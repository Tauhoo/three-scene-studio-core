export function convertToNoneDuplicateName(
  name: string,
  existingNames: string[],
  round: number = 0
) {
  const realName = name + (round === 0 ? '' : `(${round.toString()})`)
  const index = existingNames.findIndex(
    existingName => realName === existingName
  )
  if (index === -1) return realName
  return convertToNoneDuplicateName(
    name,
    [...existingNames.slice(0, index), ...existingNames.slice(index + 1)],
    round + 1
  )
}

export function convertToNoneDuplicateRef(
  ref: string,
  existingRefs: string[],
  round: number = 0
) {
  const realRef = ref + (round === 0 ? '' : `_${round.toString()}`)
  const index = existingRefs.findIndex(existingRef => realRef === existingRef)
  if (index === -1) return realRef
  return convertToNoneDuplicateRef(
    ref,
    [...existingRefs.slice(0, index), ...existingRefs.slice(index + 1)],
    round + 1
  )
}
