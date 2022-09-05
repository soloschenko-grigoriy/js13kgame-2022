import { IComponent, Vector2D } from '@/utils'
import { CanvasLayer } from '@/canvas-layer'
import { Settings } from '@/settings'
import { Turret } from '@/buildings/turret'

export class TurretDrawComponent implements IComponent {
  public Entity: Turret

  public Awake(): void {
    this.Draw()
  }

  public Update(deltaTime: number): void {
    this.Draw()
  }

  private Draw(): void {

    if(this.Entity.BeingDestroyed){
      CanvasLayer.Background.DrawImg('explosion.png', this.Entity.Node.Start, this.Entity.Node.Size)
      return
    }

    CanvasLayer.Background.DrawImg('turret3.png', this.Entity.Node.Start, this.Entity.Node.Size)

    // CanvasLayer.Background.FillSector(
    //   this.Entity.Node.Center,
    //   Settings.buildings.turret.radius,
    //   Settings.buildings.turret.colors.bg,
    //   -90,
    //   this.DegreeForCharge,
    //   true
    // )

    CanvasLayer.Background.DrawText(
      this.Entity.Population.toString(),
      new Vector2D(this.Entity.Node.Center.x - 4, this.Entity.Node.Center.y + 12),
      Settings.buildings.turret.colors.text,
      16
    )
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
