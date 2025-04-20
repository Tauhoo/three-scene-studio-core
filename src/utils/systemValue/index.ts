import * as THREE from 'three'
import { errorResponse, successResponse } from '../response'

export type SystemValueInfo =
  | {
      type: 'EULER'
      value: THREE.Euler
    }
  | {
      type: 'VECTOR_3D'
      value: THREE.Vector3
    }
  | {
      type: 'VECTOR_2D'
      value: THREE.Vector2
    }
  | {
      type: 'VECTOR'
      value: number[]
    }
  | {
      type: 'NUMBER'
      value: number
    }
  | {
      type: 'STRING'
      value: string
    }

export type SystemValueType = SystemValueInfo['type']

export type SystemValue = SystemValueInfo['value']

export function parseSystemValue(value: any) {
  if (value instanceof THREE.Vector3) {
    return successResponse({
      type: 'VECTOR_3D',
      value: value,
    } as SystemValueInfo)
  }

  if (value instanceof THREE.Vector2) {
    return successResponse({
      type: 'VECTOR_2D',
      value: value,
    } as SystemValueInfo)
  }

  if (value instanceof THREE.Euler) {
    return successResponse({
      type: 'EULER',
      value: value,
    } as SystemValueInfo)
  }

  if (Array.isArray(value)) {
    const items: number[] = []
    for (let item of value) {
      if (typeof item === 'number') {
        items.push(item)
      } else {
        return errorResponse(
          'INVALID_SYSTEM_VALUE',
          'non number found in array'
        )
      }
    }
    return successResponse({
      type: 'VECTOR',
      value: items,
    } as SystemValueInfo)
  }

  if (typeof value === 'number') {
    return successResponse({
      type: 'NUMBER',
      value: value,
    } as SystemValueInfo)
  }

  if (typeof value === 'string') {
    return successResponse({
      type: 'STRING',
      value: value,
    } as SystemValueInfo)
  }

  return errorResponse('INVALID_SYSTEM_VALUE', 'none of system value found')
}

export function systemValueToString(value: any) {
  if (value instanceof THREE.Vector3) {
    return successResponse('[' + value.toArray().join(', ') + ']')
  }

  if (value instanceof THREE.Vector2) {
    return successResponse('[' + value.toArray().join(', ') + ']')
  }

  if (value instanceof THREE.Euler) {
    return successResponse(
      '[' + value.x + ', ' + value.y + ', ' + value.z + ']'
    )
  }

  if (Array.isArray(value)) {
    const result: number[] = []
    for (let item of value) {
      if (typeof item === 'number') {
        result.push(item)
      } else {
        return errorResponse(
          'INVALID_SYSTEM_VALUE',
          'non number found in array'
        )
      }
    }
    return successResponse('[' + result.join(', ') + ']')
  }

  if (typeof value === 'number') {
    return successResponse(value + '')
  }

  if (typeof value === 'string') {
    return successResponse(value)
  }

  return errorResponse('INVALID_SYSTEM_VALUE', 'non of system value found')
}
