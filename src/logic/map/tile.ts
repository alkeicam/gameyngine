import { TileBase, TileTerrain } from "./common.notest";
/**
 * Base implementation of TileBase
 */
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
    /**
     * Creates a tile with given attributes.
     * @param x 
     * @param y 
     * @param terrainKind 
     * @param modifications 
     * @param renderableCode 
     * @returns {Tile} newly created tile
     */
    static withModifications(x:number,y: number,terrainKind: string, modifications: string[], renderableCode?: string){
        const tile = new Tile(x,y, terrainKind, renderableCode);
        tile.t.modifications = modifications

        return tile;
    }
}