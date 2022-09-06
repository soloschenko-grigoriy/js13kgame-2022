import { CanvasLayer } from '@/canvas-layer'
import { Game } from '@/game'
import { IComponent, Vector2D, OnclickComponent, OnhoverComponent } from '@/utils'

export class GameInputComponent implements IComponent {
  public Entity: Game

  private get IsOn(): boolean {
    return !this.Entity.IsModalOpen && this.Entity.IsRunning
  }

  public Awake(): void {
    document.body.addEventListener('click', this.HandleClick.bind(this))
    document.body.addEventListener('mousemove', this.HandleHover.bind(this))
  }

  public Update(deltaTime: number): void {
    // @todo
  }

  private HandleClick(e: MouseEvent): void {
    if(!this.IsOn){
      return
    }

    const point = CanvasLayer.Background.CalcLocalPointFrom(new Vector2D(e.clientX, e.clientY))
    if (!point) {
      return
    }

    for (const entity of this.Entity.Entities) {
      if (!entity.HasComponent(OnclickComponent)) {
        continue
      }

      entity.GetComponent(OnclickComponent).ClickOn(point)
    }
  }

  private HandleHover(e: MouseEvent): void {
    if(!this.IsOn){
      return
    }

    const point = CanvasLayer.Background.CalcLocalPointFrom(new Vector2D(e.clientX, e.clientY))
    if (!point) {
      return
    }

    for (const entity of this.Entity.Entities) {
      if (!entity.HasComponent(OnhoverComponent)) {
        continue
      }

      entity.GetComponent(OnhoverComponent).HoverOn(point)
    }
  }
}
