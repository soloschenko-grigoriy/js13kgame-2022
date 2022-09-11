import { IComponent, Vector2D } from '@/utils'
import { CanvasLayer } from '@/canvas-layer'
import { Settings } from '@/settings'
import { Direction, Grid } from '@/grid'
import { Turret } from '../../turret'
import { BuildingState } from '../../state'

export class TurretDrawComponent implements IComponent {
  public Entity: Turret

  public Awake(): void {
    this.Draw()
  }

  public Update(deltaTime: number): void {
    this.Draw()
  }

  private Draw(): void {
    if(this.Entity.State === BuildingState.Exploding){
      CanvasLayer.Background.DrawImg2(
        'explosion.png',
        this.Entity.Node.Center,
      )
      return
    }

    let lookAt = Direction.Up
    if(this.Entity.NodeWithEnemyToAttack){
      lookAt = Grid.CalcRotationToLooAt(this.Entity.Node, this.Entity.NodeWithEnemyToAttack)
    }

    CanvasLayer.Background.DrawImg2(
      'turret.png',
      this.Entity.Node.Center,
      new Vector2D(0.75, 0.75),
      this.CalcDirectionToAngle(lookAt)
    )

    CanvasLayer.Background.DrawText(
      this.Entity.Population.toString(),
      this.CalcTextPosition(lookAt),
      Settings.buildings.turret.colors.text,
      16
    )
  }
  public CalcTextPosition(direction: Direction): Vector2D{
    const center = this.Entity.Node.Center

    switch(direction){
      case Direction.Up: return new Vector2D(center.x - 4, center.y + 12)
      case Direction.Right: return new Vector2D(center.x - 12, center.y + 6)
      case Direction.Down: return new Vector2D(center.x - 4, center.y)
      case Direction.Left: return new Vector2D(center.x + 2, center.y + 6)
    }
  }

  public Clear(): void {
    CanvasLayer.Background.ClearRect(this.Entity.Node.Start, this.Entity.Node.Size)
  }

  private CalcDirectionToAngle(direction: Direction): number {
    switch(direction){
      case Direction.Up: return 0
      case Direction.Right: return 90
      case Direction.Down: return 180
      case Direction.Left: return -90
    }
  }
}
