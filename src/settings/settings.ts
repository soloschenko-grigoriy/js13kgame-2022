import { Color } from '@/utils'

export const Settings = Object.freeze({
  grid: {
    dimension: 11,
    nodeSize: 50,
    nodeOffset: 5,
    color: {
      regular: new Color(245, 245, 245, 1),
      onPath: new Color(239, 154, 154, 1),
      corrupted:  new Color(244, 67, 54, 1)
    }
  },
  enemy: {
    radius: 10,
    color: new Color(55, 71, 79, 1),
    locomotion: {
      range: 3,
      duration: 300
    },
    occupationTime: 1000,
    spawnCooldown: 2
  },
  buildings: {
    turret: {
      colors: {
        bg: new Color(255, 235, 59, 0.),
        text: new Color(38, 50, 56, 1),
      },
      radius: 15,
      amount: 2,
      population: 4
    },
    house: {
      colors: {
        bg: new Color(46, 125, 50, 1),
        text: new Color(255, 255, 255, 1),
      },
      amount: 10,
      population: 50
    },
  },
  hiddenClassName: 'hidden',
  evacuationAmount: 5,
  evacuationCooldown: 5,
  debugMode: false
})
