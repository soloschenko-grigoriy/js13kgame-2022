import { IComponent, Vector2D } from '@/utils'
import { CanvasLayer } from '@/canvas-layer'
import { Settings } from '@/settings'
import { Turret } from '@/buildings/turret'
import { BuildingState } from '@/buildings/state'

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
      CanvasLayer.Background.DrawImg('explosion.png', new Vector2D(this.Entity.Node.Start.x + 12, this.Entity.Node.Start.y + 5))
      return
    }

    CanvasLayer.Background.DrawImg('turret3.png', new Vector2D(this.Entity.Node.Start.x + 7, this.Entity.Node.Start.y + 3), new Vector2D(this.Entity.Node.Size.x - 15, this.Entity.Node.Size.y - 7) )
    CanvasLayer.Background.DrawText(
      this.Entity.Population.toString(),
      new Vector2D(this.Entity.Node.Center.x - 4, this.Entity.Node.Center.y + 12),
      Settings.buildings.turret.colors.text,
      16
    )
  }

  public Clear(): void {
    CanvasLayer.Background.ClearRect(this.Entity.Node.Start, this.Entity.Node.Size)
  }

  private get DegreeForCharge(): number {
    if(this.Entity.Population === 4){
      return 270
    }

    if(this.Entity.Population === 3){
      return 0
    }

    if(this.Entity.Population === 2){
      return 90
    }

    if(this.Entity.Population === 1){
      return 180
    }

    return -90
  }
}
