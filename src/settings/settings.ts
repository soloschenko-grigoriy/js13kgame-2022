import { Color } from '@/utils'

export const Settings = Object.freeze({
  grid: {
    dimension: 11,
    nodeSize: 50,
    nodeOffset: 5,
    color: {
      regular: new Color(245, 245, 245, 1),
      onPath: new Color(51, 255, 153, 1),
      corrupted:  new Color(0, 0, 0, 1)
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
      duration: 50
    },
    occupationTime: 300
  },
  debugMode: true
})
