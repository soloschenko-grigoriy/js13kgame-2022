import { Game } from '@/game'
import { Grid } from '@/grid'
import { EnemyController } from '@/enemy-controller'
import { Nation } from '@/nation'

const grid = new Grid()
const enemyController = new EnemyController(grid)
const nation = new Nation(grid)

 new Game(
   grid,
   enemyController,
   nation
 ).Awake()
