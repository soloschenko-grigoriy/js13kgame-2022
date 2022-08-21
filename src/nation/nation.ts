import { BuildingType } from '@/buildings'
import { Grid } from '@/grid'
import { Settings } from '@/settings'
import { Entity, random } from '@/utils'

export class Nation extends Entity {

  private _peopleInDanger = 0
  private _peopleSaved = 0

  public get PeopleInDanger(): number {
    return this._peopleInDanger
  }

  public get PeopleSaved(): number {
    return this._peopleSaved
  }

  constructor(private readonly _grid: Grid){
    super()

    this._peopleInDanger =
      Settings.buildings.house.population * Settings.buildings.house.amount +
      Settings.buildings.turret.population * Settings.buildings.turret.amount
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
    this._peopleInDanger -= population
  }

  private InitBuildings(type: BuildingType, amount: number, xMin: number, xMax: number, yMin: number, yMax: number): void {
    let alreadyBuilt = 0
    while(alreadyBuilt < amount){
      const x = random(xMin, xMax)
      const y = random(yMin, yMax)

      const node = this._grid.Nodes.find(n => n.Index.x == x && n.Index.y === y)

      if(node && !node.Building){
        node.Build(type, this)
        alreadyBuilt++
      }
    }
  }
}
