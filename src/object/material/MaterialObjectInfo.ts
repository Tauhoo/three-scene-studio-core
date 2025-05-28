import * as THREE from 'three'
import * as z from 'zod'
import { InSceneObjectInfoEvent } from '../InSceneObjectInfo'
import { v4 as uuidv4 } from 'uuid'
import EventDispatcher from '../../utils/EventDispatcher'
import { MapTypeDefinition } from '../property'
import { ObjectInfo } from '../ObjectInfo'

export const materialObjectConfigSchema = z.object({
  type: z.literal('OBJECT_3D_MATERIAL'),
  id: z.string(),
})

export type MaterialObjectConfig = z.infer<typeof materialObjectConfigSchema>

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

export class MaterialObjectInfo extends ObjectInfo {
  propertyTypeDefinition: MapTypeDefinition =
    materialObjectInfoPropertyTypeDefinition
  readonly config: MaterialObjectConfig
  readonly data: THREE.Material
  readonly eventDispatcher: EventDispatcher<InSceneObjectInfoEvent>

  constructor(data: THREE.Material) {
    super()
    const actualId =
      data.userData['THREE_SCENE_STUDIO.OBJECT_CONFIG']?.id ?? uuidv4()
    this.config = {
      type: 'OBJECT_3D_MATERIAL',
      id: actualId,
    }
    data.userData['THREE_SCENE_STUDIO.OBJECT_CONFIG'] = this.config
    this.data = data
    this.eventDispatcher = new EventDispatcher()
  }
}
