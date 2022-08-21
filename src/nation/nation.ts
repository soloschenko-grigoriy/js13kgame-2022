import { BuildingType } from '@/buildings'
import { Grid } from '@/grid'
import { Settings } from '@/settings'
import { Entity, random } from '@/utils'

export class Nation extends Entity {

  private _population = 0

  constructor(private readonly _grid: Grid){
    super()

    this._population = Settings.buildings.house.capacity * Settings.buildings.house.amount
  }

  public Awake(): void {
    super.Awake()

    this.InitBuildings(BuildingType.House, Settings.buildings.house.amount, 1, Settings.grid.dimension - 2, 1, Settings.grid.dimension - 2)
    this.InitBuildings(BuildingType.Turret, Settings.buildings.turret.amount, 6, Settings.grid.dimension - 3, 1, Settings.grid.dimension - 2)
  }

  public Update(deltaTime: number): void {
    super.Update(deltaTime)
  }

  public ReduceTotalPopulation(population: number): void {
    this._population -= population
  }

  private InitBuildings(type: BuildingType, amount: number, xMin: number, xMax: number, yMin: number, yMax: number): void {
    let alreadyBuilt = 0
    while(alreadyBuilt < amount){
      const x = random(xMin, xMax)
      const y = random(yMin, yMax)

      const node = this._grid.Nodes.find(n => n.Index.x == x && n.Index.y === y)

      if(node && !node.Building){
        node.Build(type)
        alreadyBuilt++
      }
    }
  }
}
