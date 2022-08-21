import { Entity } from '@/utils'
import { Node } from '@/node'
import { BuildingType } from './building.h'
import { BuildingDrawHouseComponent, BuildingDrawTurretComponent } from './components'

export class Building extends Entity {
  public get Type(): BuildingType {
    return this._type
  }

  public get Node(): Node {
    return this._node
  }

  constructor(private readonly _type: BuildingType, private readonly _node: Node){
    super()

    const drawComponent = _type === BuildingType.House ? new BuildingDrawHouseComponent() : new BuildingDrawTurretComponent()

    this.AddComponent(drawComponent)
  }

  public Awake(): void {
    super.Awake()
  }

  public Update(deltaTime: number): void {
    super.Update(deltaTime)
  }

  public Destroy(): void {
    console.log('building destroyed')
  }
}
