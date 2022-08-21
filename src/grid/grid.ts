import { Entity, Vector2D, IGraph, IGraphNode, random } from '@/utils'
import { Node } from '@/node'
import { Settings } from '@/settings'
import { GridOnclickComponent } from './components'
import { BuildingType } from '@/buildings'

export class Grid extends Entity implements IGraph {
  private _nodes: Node[] = []

  public static Heuristic = (a: IGraphNode, b: IGraphNode): number => Math.abs(a.Position.x - b.Position.x) + Math.abs(a.Position.y - b.Position.y)

  public get Nodes(): Node[] {
    return this._nodes
  }

  public Awake(): void {
    this.AddComponent(new GridOnclickComponent())

    // awake components
    super.Awake()

    // prepare children
    this.InitNodes()

    // setup buildings
    this.InitBuildings()

    // awake children
    for (const node of this._nodes) {
      node.Awake()
    }
  }

  public Update(deltaTime: number): void {
    // update components
    super.Update(deltaTime)

    // update children
    for (const node of this._nodes) {
      node.Update(deltaTime)
    }
  }

  public GetCost(a: Node, b: Node): number {
    return 1
  }

  public GetNeighborsOf(node: Node): Node[] {
    return node.Neighbors
  }

  private InitNodes(): void {
    const size = Settings.grid.nodeSize
    const offset = Settings.grid.nodeOffset
    for (let y = 0; y < Settings.grid.dimension; y++) {
      for (let x = 0; x < Settings.grid.dimension; x++) {
        const start = new Vector2D(
          x * (size + offset) + offset,
          y * (size + offset) + offset
        )

        const end = new Vector2D(
          start.x + size,
          start.y + size
        )

        const index = new Vector2D(x, y)

        const top = this.Nodes.find(node => node.Index.x === index.x && node.Index.y === index.y - 1)
        const left = this.Nodes.find(node => node.Index.x === index.x - 1 && node.Index.y === index.y)

        const neighbors: Node[] = []
        const node = new Node(start, end, index, neighbors)

        if (top) {
          neighbors.push(top)
          top.Neighbors.push(node)
        }

        if (left) {
          neighbors.push(left)
          left.Neighbors.push(node)
        }

        this._nodes.push(node)
      }
    }
  }

  private InitBuildings(): void {

    let housesBuilt = 0
    while(housesBuilt < Settings.buildings.house.amount){
      const x = random(1 , Settings.grid.dimension - 2)
      const y = random(1 , Settings.grid.dimension - 2)

      const node = this._nodes.find(n => n.Index.x == x && n.Index.y === y)

      if(node && !node.Building){
        node.Build(BuildingType.House)
        housesBuilt++
      }
    }

    let turretsBuilt = 0
    while(turretsBuilt < Settings.buildings.turret.amount){
      const x = random(6, Settings.grid.dimension - 3)
      const y = random(1, Settings.grid.dimension - 2)

      const node = this._nodes.find(n => n.Index.x == x && n.Index.y === y)

      if(node && !node.Building){
        node.Build(BuildingType.Turret)
        turretsBuilt++
      }
    }
  }
}
