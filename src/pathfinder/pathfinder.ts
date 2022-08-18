import { IGraph, IGraphNode, PriorityQueue } from '@/utils'

export class Pathfinder {
  constructor(
    private readonly _graph: IGraph,
    private readonly _heuristic: (a: IGraphNode, b: IGraphNode) => number
    ){}

  public CalculatePath(from: IGraphNode): IGraphNode[]{
    const path: IGraphNode[] = []
    const { goal, cameFrom } = this.FindNext(from)
    if(!goal || !goal.IsGoodNextTarget){
      // game over
      return path
    }

    let current: IGraphNode | null = goal

    while (current && current !== from){
      path.push(current)
      current = cameFrom[current.Position.AsString()]
    }

    path.reverse()

    return path
  }

  private GetCameFrom (start: IGraphNode, goal: IGraphNode): Record<string, IGraphNode | null> {
    const cameFrom: Record<string, IGraphNode | null> = {
      [start.Position.AsString()]: null
    }
    const costSoFar: Record<string, number> = {
      [start.Position.AsString()]: 0
    }

    const frontier = new PriorityQueue<IGraphNode>()

    frontier.Enqueue(start, 0)

    while (!frontier.IsEmpty) {
      const current = frontier.Dequeue()

      if(current === goal){
        break
      }

      for (const next of this._graph.GetNeighborsOf(current)) {
        const newCost = costSoFar[current.Position.AsString()] + this._graph.GetCost(current, next)
        const nextStr = next.Position.AsString()
        if (typeof costSoFar[nextStr] === 'undefined' || newCost < costSoFar[nextStr]){
          const priority = newCost + this._heuristic(goal, next)
          costSoFar[nextStr] = newCost
          frontier.Enqueue(next, priority)
          cameFrom[nextStr] = current
        }
      }
    }

    return cameFrom
  }

  private FindNext (start: IGraphNode): {goal: IGraphNode | null; cameFrom: Record<string, IGraphNode | null>}  {
    const cameFrom: Record<string, IGraphNode | null> = {
      [start.Position.AsString()]: null
    }
    const costSoFar: Record<string, number> = {
      [start.Position.AsString()]: 0
    }

    const frontier = new PriorityQueue<IGraphNode>()
    let current: IGraphNode | null = null

    frontier.Enqueue(start, 0)

    while (!frontier.IsEmpty) {
      current = frontier.Dequeue()

      if(current.IsGoodNextTarget){
        break
      }

      for (const next of this._graph.GetNeighborsOf(current)) {
        const newCost = costSoFar[current.Position.AsString()] + this._graph.GetCost(current, next)
        const nextStr = next.Position.AsString()
        if (typeof costSoFar[nextStr] === 'undefined' || newCost < costSoFar[nextStr]){
          costSoFar[nextStr] = newCost
          frontier.Enqueue(next, 1)
          cameFrom[nextStr] = current
        }
      }
    }

    return { goal: current, cameFrom}
  }
}
