import { Game } from '@/game'
import { Grid } from '@/grid'
import { EnemyController } from '@/enemy-controller'

const grid = new Grid()
const enemyController = new EnemyController(grid)

 new Game(
   grid,
   enemyController,
 ).Awake()
