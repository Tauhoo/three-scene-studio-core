import { ThreeSceneStudioManager } from '../ThreeSceneStudioManager'

function exportConfig(threeSceneStudioManager: ThreeSceneStudioManager) {
  return threeSceneStudioManager.serialize()
}
