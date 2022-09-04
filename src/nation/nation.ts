import { BuildingType } from '@/buildings'
import { Grid } from '@/grid'
import { Settings } from '@/settings'
import { Entity, random } from '@/utils'

export class Nation extends Entity {

  private _peopleInDanger = 0
  private _peopleSaved = 0
  private _timeTillNextEvacuation = Settings.evacuationCooldown
  private _elapsedSinceLastEvacuation = 0

  public get PeopleInDanger(): number {
    return this._peopleInDanger
  }

  public get PeopleSaved(): number {
    return this._peopleSaved
  }

  public get TimeTillNextEvacuation(): number {
    return this._timeTillNextEvacuation
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

    if(this._timeTillNextEvacuation > 0){
      this._elapsedSinceLastEvacuation += deltaTime
      this._timeTillNextEvacuation = Settings.evacuationCooldown - Math.round(this._elapsedSinceLastEvacuation)
    } else {
      this._timeTillNextEvacuation = 0
    }
  }

  public ReduceTotalPopulation(population: number): void {
    this._peopleInDanger -= population
  }

  public Evacuate(people: number):void {
    this._peopleSaved += people
    this.ReduceTotalPopulation(people)

    this._elapsedSinceLastEvacuation = 0
    this._timeTillNextEvacuation = Settings.evacuationCooldown

    console.log(`You saved ${people} !`)
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
