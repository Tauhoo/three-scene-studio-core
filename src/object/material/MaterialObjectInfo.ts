import * as THREE from 'three'
import EventDispatcher, { EventPacket } from '../../utils/EventDispatcher'
import { MapTypeDefinition } from '../property'
import { ObjectInfo, ObjectInfoEvent } from '../ObjectInfo'
import {
  getTextureObjectInfo,
  TextureObjectInfoMap,
} from './getTextureObjectInfo'
import { ObjectInfoStorage } from '../ObjectInfoStorage'
import { TextureObjectInfo } from '../TextureObjectInfo'

export const materialObjectInfoPropertyTypeDefinition: MapTypeDefinition = {
  type: 'MAP',
  map: {
    name: { type: 'STRING' },
    alphaHash: { type: 'BOOLEAN' },
    alphaToCoverage: { type: 'BOOLEAN' },
    blendAlpha: { type: 'NUMBER' },
    blendColor: { type: 'COLOR' },
    // blendDst: BlendingDstFactor;
    // blendDstAlpha: number | null;
    // blendEquation: BlendingEquation;
    // blendEquationAlpha: number | null;
    // blending: Blending;
    // blendSrc: BlendingSrcFactor | BlendingDstFactor;
    // blendSrcAlpha: number | null;
    clipIntersection: { type: 'BOOLEAN' },
    // clippingPlanes: Plane[] | null;
    clipShadows: { type: 'BOOLEAN' },
    colorWrite: { type: 'BOOLEAN' },
    // defines: undefined | { [key: string]: any };
    // depthFunc: DepthModes;
    depthTest: { type: 'BOOLEAN' },
    depthWrite: { type: 'BOOLEAN' },
    stencilWrite: { type: 'BOOLEAN' },
    // stencilFunc: StencilFunc;
    stencilRef: { type: 'NUMBER' },
    stencilWriteMask: { type: 'NUMBER' },
    stencilFuncMask: { type: 'NUMBER' },
    // stencilFail: StencilOp;
    // stencilZFail: StencilOp;
    // stencilZPass: StencilOp;
    opacity: { type: 'NUMBER' },
    polygonOffset: { type: 'BOOLEAN' },
    polygonOffsetFactor: { type: 'NUMBER' },
    polygonOffsetUnits: { type: 'NUMBER' },
    // precision: "highp" | "mediump" | "lowp" | null;
    premultipliedAlpha: { type: 'NUMBER' },
    forceSinglePass: { type: 'NUMBER' },
    dithering: { type: 'NUMBER' },
    // side: Side;
    // shadowSide: Side | null;
    toneMapped: { type: 'BOOLEAN' },
    transparent: { type: 'BOOLEAN' },
    vertexColors: { type: 'BOOLEAN' },
    visible: { type: 'BOOLEAN' },
    alphaTest: { type: 'NUMBER' },
  },
}

export type MaterialObjectInfoEvent =
  | EventPacket<'TEXTURE_UPDATED', MaterialObjectInfo>
  | ObjectInfoEvent

export abstract class MaterialObjectInfo extends ObjectInfo {
  propertyTypeDefinition: MapTypeDefinition =
    materialObjectInfoPropertyTypeDefinition
  readonly data: THREE.Material
  readonly eventDispatcher: EventDispatcher<MaterialObjectInfoEvent>
  readonly textureObjectInfoMap: TextureObjectInfoMap

  constructor(
    data: THREE.Material,
    objectInfoStorage: ObjectInfoStorage,
    mapKeys: readonly string[]
  ) {
    super()
    this.data = data
    this.eventDispatcher = new EventDispatcher()
    this.textureObjectInfoMap = getTextureObjectInfo(
      objectInfoStorage,
      data,
      mapKeys
    )
    this.registerEvent()
  }

  private onTextureDestroyed = (objectInfo: ObjectInfo) => {
    for (const key in this.textureObjectInfoMap) {
      const textureObjectInfo = this.textureObjectInfoMap[key]
      if (textureObjectInfo === objectInfo) {
        this.textureObjectInfoMap[key] = null
        ;(this.data as any)[key] = null
        this.data.needsUpdate = true
      }
    }
    this.eventDispatcher.dispatch('TEXTURE_UPDATED', this)
  }

  private registerEvent() {
    for (const textureObjectInfo of Object.values(this.textureObjectInfoMap)) {
      if (textureObjectInfo !== null) {
        textureObjectInfo.eventDispatcher.addListener(
          'DESTROY',
          this.onTextureDestroyed
        )
      }
    }
  }

  private unregisterEvent() {
    for (const textureObjectInfo of Object.values(this.textureObjectInfoMap)) {
      if (textureObjectInfo !== null) {
        textureObjectInfo.eventDispatcher.removeListener(
          'DESTROY',
          this.onTextureDestroyed
        )
      }
    }
  }

  replaceTexture(key: string, textureObjectInfo: TextureObjectInfo | null) {
    const existTexture = this.textureObjectInfoMap[key]
    if (existTexture !== null) {
      existTexture.eventDispatcher.removeListener(
        'DESTROY',
        this.onTextureDestroyed
      )
    }
    this.textureObjectInfoMap[key] = textureObjectInfo
    if (textureObjectInfo !== null) {
      textureObjectInfo.eventDispatcher.addListener(
        'DESTROY',
        this.onTextureDestroyed
      )
    }
  }

  destroy() {
    this.unregisterEvent()
  }
}
