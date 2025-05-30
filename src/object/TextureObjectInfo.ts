import * as THREE from 'three'
import {
  objectConfigSchema,
  objectInfoPropertyTypeDefinition,
  ObjectInfo,
  ObjectInfoEvent,
} from './ObjectInfo'
import * as z from 'zod'
import EventDispatcher from '../utils/EventDispatcher'
import { MapTypeDefinition } from './property'
import { v4 as uuidv4 } from 'uuid'
import { errorResponse } from '../utils'

export const textureObjectConfigSchema = objectConfigSchema.extend({
  type: z.literal('TEXTURE'),
})

export type TextureObjectConfig = z.infer<typeof textureObjectConfigSchema>

export const textureObjectInfoPropertyTypeDefinition: MapTypeDefinition = {
  type: 'MAP',
  map: {
    ...objectInfoPropertyTypeDefinition.map,
    name: { type: 'STRING' },
    offset: { type: 'VECTOR_2D' },
    repeat: { type: 'VECTOR_2D' },
    center: { type: 'VECTOR_2D' },
    rotation: { type: 'NUMBER' },
    premultiplyAlpha: { type: 'BOOLEAN' },
    flipY: { type: 'BOOLEAN' },
  },
}

export class TextureObjectInfo extends ObjectInfo {
  readonly config: TextureObjectConfig
  readonly data: THREE.Texture
  readonly eventDispatcher: EventDispatcher<ObjectInfoEvent>
  propertyTypeDefinition: MapTypeDefinition =
    textureObjectInfoPropertyTypeDefinition
  readonly base64Image: string

  constructor(data: THREE.Texture) {
    super()
    const actualId =
      data.userData['THREE_SCENE_STUDIO.OBJECT_CONFIG']?.id ?? uuidv4()
    this.config = {
      type: 'TEXTURE',
      id: actualId,
    }
    data.userData['THREE_SCENE_STUDIO.OBJECT_CONFIG'] = this.config
    this.data = data
    this.eventDispatcher = new EventDispatcher()
    this.base64Image = textureToBase64(data)
  }
}

function textureToBase64(texture: THREE.Texture) {
  const image = texture.image
  const canvas = document.createElement('canvas')
  canvas.width = image.width
  canvas.height = image.height

  const ctx = canvas.getContext('2d')
  if (ctx === null) {
    throw errorResponse(
      'CREATE_TEXTURE_IMAGE_FAILED',
      'Failed to create canvas context'
    )
  }
  ctx.drawImage(image, 0, 0)

  // You can change 'image/png' to 'image/jpeg' and set quality if needed
  return canvas.toDataURL('image/png')
}
