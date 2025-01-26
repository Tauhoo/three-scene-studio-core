import { InSceneObjectInfo } from '../object'

export const extractSelectedObjects = (
  objectInfo: InSceneObjectInfo,
  selectedObjectIds: Set<string>
) => {
  const result: InSceneObjectInfo[] = []
  for (const child of objectInfo.children) {
    if (selectedObjectIds.has(child.config.id)) {
      result.push(child)
    } else {
      const subResult = extractSelectedObjects(child, selectedObjectIds)
      result.push(...subResult)
    }
  }
  return result
}
