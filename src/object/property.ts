export type PropertyType =
  | { type: 'VECTOR_3D' }
  | { type: 'VECTOR_2D' }
  | { type: 'NUMBER' }
  | { type: 'STRING' }

export type PropertyTypeMap = {
  [path: string]: PropertyType | PropertyTypeMap
}
