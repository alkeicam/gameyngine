import { TileBase, TileTerrain } from "./common.notest";

export class Tile implements TileBase {
    id: string;
    x: number;
    y: number;
    t: TileTerrain;
    r?: string | undefined;

    constructor(x:number,y: number,terrainKind: string, renderableCode?: string){
        this.x = x;
        this.y = y;
        this.t = {
            kind: terrainKind
        }
        this.r = renderableCode
        this.id = `${x},${y}`
    }
}