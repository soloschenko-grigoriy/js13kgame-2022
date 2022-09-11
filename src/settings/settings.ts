import { Color } from '@/utils'

export const Settings = Object.freeze({
  grid: {
    dimension: 11,
    nodeSize: 50,
    nodeOffset: 0.00001,
    color: {
      hover: new Color(255, 255, 114, 1),
    }
  },
  enemy: {
    radius: 10,
    color: new Color(55, 71, 79, 1),
    locomotion: {
      range: 3,
      duration: 100
    },
    occupationTime: 300,
    spawnCooldown: 2,
    explosionTime: 1
  },
  buildings: {
    turret: {
      colors: {
        bg: new Color(255, 235, 59, 0.25),
        text: new Color(38, 50, 56, 1),
      },
      radius: 15,
      amount: 2,
      population: 5,
      explosionTime: 2
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
