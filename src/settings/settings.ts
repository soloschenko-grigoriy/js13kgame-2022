import { Color } from '@/utils'

export const Settings = Object.freeze({
  grid: {
    dimension: 11,
    nodeSize: 50,
    nodeOffset: 5,
    color: {
      regular: new Color(245, 245, 245, 1),
      inLocomotionRange: new Color(176, 190, 197, 1),
      onPath: new Color(51, 255, 153, 1)
    }
  },
  enemy: {
    radius: 20,
    colors: {
      a: new Color(187, 222, 251, 1),
      b: new Color(255, 236, 179, 1)
    },
    locomotion: {
      range: 3,
      duration: 300
    },
  },
  debugMode: true
})
