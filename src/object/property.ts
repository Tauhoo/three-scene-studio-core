import { errorResponse, NodeValueType, successResponse } from '../utils'
import { SystemValueType } from '../utils'
export type PropertyTypeDefinition =
  | { type: SystemValueType }
  | MapTypeDefinition

export type MapTypeDefinition = {
  type: 'MAP'
  map: {
    [path: string]: PropertyTypeDefinition
  }
}

export function propertyTypeAndNodeValueTypeCompatible(
  propertyTypeDefinition: PropertyTypeDefinition,
  nodeValueType: NodeValueType
) {
  if (nodeValueType === 'NUMBER') {
    if (
      propertyTypeDefinition.type === 'NUMBER' ||
      propertyTypeDefinition.type === 'BOOLEAN'
    ) {
      return successResponse(null)
    } else {
      return errorResponse(
        'INVALID_PROPERTY_TYPE',
        'Property type is not compatible with node value type'
      )
    }
  }

  if (nodeValueType === 'VECTOR') {
    if (
      propertyTypeDefinition.type === 'VECTOR_3D' ||
      propertyTypeDefinition.type === 'VECTOR_2D' ||
      propertyTypeDefinition.type === 'EULER' ||
      propertyTypeDefinition.type === 'VECTOR' ||
      propertyTypeDefinition.type === 'COLOR'
    ) {
      return successResponse(null)
    } else {
      return errorResponse(
        'INVALID_PROPERTY_TYPE',
        'Property type is not compatible with node value type'
      )
    }
  }

  return errorResponse(
    'INVALID_NODE_VALUE_TYPE',
    'Node value type is not compatible with property type'
  )
}

export function getProperyTypeFromMap(
  paths: string[],
  propertyTypeDefinition: PropertyTypeDefinition
) {
  let currentDefinition = propertyTypeDefinition
  for (const path of paths) {
    if (currentDefinition.type === 'MAP') {
      if (currentDefinition.map[path] === undefined) {
        return errorResponse('INVALID_PATH', 'Path not found')
      }
      currentDefinition = currentDefinition.map[path]
      continue
    }

    if (
      currentDefinition.type === 'VECTOR_3D' &&
      ['x', 'y', 'z'].includes(path)
    ) {
      currentDefinition = {
        type: 'NUMBER',
      }
      continue
    }

    if (currentDefinition.type === 'COLOR' && ['r', 'g', 'b'].includes(path)) {
      currentDefinition = {
        type: 'NUMBER',
      }
      continue
    }

    if (currentDefinition.type === 'VECTOR_2D' && ['x', 'y'].includes(path)) {
      currentDefinition = {
        type: 'NUMBER',
      }
      continue
    }

    if (currentDefinition.type === 'EULER' && ['x', 'y', 'z'].includes(path)) {
      currentDefinition = {
        type: 'NUMBER',
      }
      continue
    }

    return errorResponse('OUT_OF_PATH', 'No more path to go')
  }

  return successResponse(currentDefinition)
}
