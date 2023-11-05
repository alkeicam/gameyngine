// import chai, { assert } from 'chai'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'


chai.should();
chai.use(chaiAsPromised);

// const assert = chai.assert;

const expect = chai.expect;

// Sinon is a library used for mocking or verifying function calls in JavaScript.
import sinon, { SinonStub } from 'sinon';


import {TileBase} from '../src/logic/map/common.notest'
import {MapBase, MapHexOddQ, MapSquare, Neighbour, Path, Paths,} from '../src/logic/map/map'
import {MapsFileMocks, MapsMocks, TerrainMocks, TileMocks} from './data.mock'
import {CostCalculator, CostCalculatorConst, CostCalculatorTerrain} from "../src/logic/map/costs"
import {ActionContextUnitAttack, ActionContextUnitMove, ActionUnitAttack, ActionUnitFortify, ActionUnitLandFieldOfView, ActionUnitMove} from "../src/logic/units/actions/action"
import { SpecsBase, SpecsLocation } from '../src/logic/units/unit';
import {Utils} from "../src/util/utils";

import { GameygineEvents } from '../src/util/eventDictionary.notest';
import EventEmitter from 'eventemitter3';
import { Tile } from '../src/logic/map/tile';

const messageBus = new EventEmitter();



describe('GameYngine', () => {
    describe('MapSquare', () => {   
        describe("_direction2",()=>{
            let mappy:MapSquare;
            const width:number =  6;
            const height:number =  5;
            beforeEach(() => {  
                mappy = new MapSquare(height, width);
            });
            it("check",()=>{
                expect(mappy._direction(0,-1)).eq("N")
                expect(mappy._direction(0,1)).eq("S")
                expect(mappy._direction(-1,-1)).eq("NW")
                expect(mappy._direction(1,-1)).eq("NE")
                expect(mappy._direction(-1,0)).eq("W")
                expect(mappy._direction(1,0)).eq("E")
                expect(mappy._direction(-1,1)).eq("SW")
                expect(mappy._direction(1,1)).eq("SE")

                expect(()=>{mappy._direction(-2,0)}).to.throw("dx,dy must be one of -1, 0, 1")
                expect(()=>{mappy._direction(2,0)}).to.throw("dx,dy must be one of -1, 0, 1")
                expect(()=>{mappy._direction(0,-2)}).to.throw("dx,dy must be one of -1, 0, 1")
                expect(()=>{mappy._direction(0,2)}).to.throw("dx,dy must be one of -1, 0, 1")
                expect(()=>{mappy._direction(2,2)}).to.throw("dx,dy must be one of -1, 0, 1")
                expect(()=>{mappy._direction(-2,-2)}).to.throw("dx,dy must be one of -1, 0, 1")

                expect(()=>{mappy._direction(0,0)}).to.throw("can't calculate direction")
            })
        })
        // describe('_direction', () => {   
        //     let mappy:MapSquare;
        //     const width:number =  10;
        //     const height:number =  12;

        //     // let INPUT = 'hello world';
        //     // let INPUT_MULTI = `
            
        //     // some crazy

        //     // multiline imput
            
        //     // `
        //     // let INPUT_SPECIAL = '\n\n\n\n\n\n\n\t\t\t';
        //     // let SYMBOL = '*';
        //     // let HOW_MANY = 7;
        //     // let EXTERNAL_KEY = 'x909as9ds';         
        //     beforeEach(() => {  
        //         mappy = new MapSquare(width, height);
        //     });
        //     afterEach(() => {                  
        //     });

        //     it('S', () => {    
        //         const direction:string = mappy._direction(1,0); 
        //         return expect(direction).eq("S")
                
        //     })
        //     it("SW", () => {    
        //         const direction:string = mappy._direction(1,-1); 
        //         return expect(direction).eq("SW")
                
        //     })
        //     it("SE", () => {    
        //         const direction:string = mappy._direction(1,1); 
        //         return expect(direction).eq("SE")
                
        //     })
        //     it('N', () => {    
        //         const direction:string = mappy._direction(-1,0); 
        //         return expect(direction).eq("N")
                
        //     })
        //     it("NW", () => {    
        //         const direction:string = mappy._direction(-1,-1); 
        //         return expect(direction).eq("NW")
                
        //     })
        //     it("NE", () => {    
        //         const direction:string = mappy._direction(-1,1); 
        //         return expect(direction).eq("NE")
                
        //     })
        //     it('W', () => {    
        //         const direction:string = mappy._direction(0,-1); 
        //         return expect(direction).eq("W");                
        //     })
        //     it("E", () => {    
        //         const direction:string = mappy._direction(0,1); 
        //         return expect(direction).eq("E");                
        //     })
        //     it('Illegal args #1', () => {    
        //         return expect(()=>{mappy._direction(-3,9)}).to.throw('Invalid arguments');                                                      
        //     })
        //     it('Illegal args #2' , () => {    
        //         return expect(()=>{mappy._direction(0,0)}).to.throw('Invalid arguments');                                      
        //     })
        //     // return expect(()=>{anonymise(INPUT, SYMBOL, INPUT.length+10)}).to.throw('Cant anonymise more chars than the input length');                      
        //     // it('invalid symbol', () => {     
        //     //     return expect(()=>{anonymise(INPUT, '', INPUT.length+10)}).to.throw('Symbol must be of length 1');                      
        //     // })
        //     // it('undefined symbol', () => {     
        //     //     return expect(()=>{anonymise(INPUT, undefined, INPUT.length+10)}).to.throw('Symbol must be of length 1');                      
        //     // })
        //     // it('by default anonymise half the chars', () => {    
        //     //     let record = anonymise(INPUT, SYMBOL);
        //     //     let rexp = new RegExp('\\'+SYMBOL,"gim")            
        //     //     return expect((record.v.match(rexp) || []).length).eq(Math.ceil(INPUT.length/2))
        //     // })
        //     // it('number of chars for anonymisation is provided', () => {    
        //     //     let record = anonymise(INPUT, SYMBOL, HOW_MANY);
        //     //     let rexp = new RegExp('\\'+SYMBOL,"gim")            
        //     //     return expect((record.v.match(rexp) || []).length).eq(HOW_MANY)
        //     // })
        //     // it('record key is generated when external key is not provided', () => {    
        //     //     let record = anonymise(INPUT, SYMBOL, HOW_MANY);            
        //     //     return expect(record.k).is.not.undefined;
        //     // })
        //     // it('external key is used when provided', () => {    
        //     //     let record = anonymise(INPUT, SYMBOL, HOW_MANY, EXTERNAL_KEY);                        
        //     //     return expect(record.k).eq(EXTERNAL_KEY);
        //     // })
        //     // it('multiline input', () => {    
        //     //     let record = anonymise(INPUT_MULTI, SYMBOL, HOW_MANY);
        //     //     let rexp = new RegExp('\\'+SYMBOL,"gim") 
        //     //     return expect((record.v.match(rexp) || []).length).eq(HOW_MANY)
        //     // })
        //     // it('special chars input', () => {    
        //     //     let record = anonymise(INPUT_SPECIAL, SYMBOL, HOW_MANY);
        //     //     let rexp = new RegExp('\\'+SYMBOL,"gim") 
        //     //     return expect((record.v.match(rexp) || []).length).eq(HOW_MANY)
        //     // })
            
        // })
        
        describe('fromTiles', () => {                           
            beforeEach(() => {  
                                
            });
            afterEach(() => {                  
            });

            it('map size', () => {    
                let mappy:MapSquare = new MapSquare(6, 5);
                mappy.fromTiles(MapsMocks.map_6x5);
                return expect(Array.from(mappy.theMap).length).eq(30);                
            })   
            
            it('size check', () => {    
                let mappy:MapSquare = new MapSquare(6, 5);
                mappy.fromTiles(MapsMocks.map_5x6);
                return expect(Array.from(mappy.theMap).length).eq(30);                
            }) 

            it('size check #2', () => {    
                let mappy:MapSquare = new MapSquare(4, 4);
                return expect(()=>{mappy.fromTiles(MapsMocks.map_5x6)}).to.throw('Invalid arguments');                              
            }) 
            it('size check #3', () => {    
                let mappy:MapSquare = new MapSquare(4, 4);
                return expect(()=>{mappy.fromTiles(MapsMocks.map_5x6)}).to.throw('Invalid arguments');                              
            }) 
        })
        
        describe('neighbours', () => {   
            let mappy:MapSquare;
            const width:number =  6;
            const height:number =  5;
            
            beforeEach(() => {  
                mappy = new MapSquare(height, width);
                mappy.fromTiles(MapsMocks.map_6x5)
            });
            afterEach(() => {                  
            });

            it('upper left', () => {    
                const neighbours: Neighbour[] = mappy.neighbours(new Tile(0,0,"PLAINS"));
                expect(neighbours).length(3);
                expect(neighbours.find(item=>item.target.id=="1,0")?.direction).eq("E");
                expect(neighbours.find(item=>item.target.id=="1,1")?.direction).eq("SE");
                expect(neighbours.find(item=>item.target.id=="0,1")?.direction).eq("S");
            })
            it('upper right', () => {    
                const neighbours: Neighbour[] = mappy.neighbours(new Tile(5,0,"PLAINS"));
                expect(neighbours).length(3);
                expect(neighbours.find(item=>item.target.id=="4,0")?.direction).eq("W");
                expect(neighbours.find(item=>item.target.id=="4,1")?.direction).eq("SW");
                expect(neighbours.find(item=>item.target.id=="5,1")?.direction).eq("S");
            }) 
            it("middle",()=>{
                const neighbours: Neighbour[] = mappy.neighbours(new Tile(2,1,"PLAINS"));
                expect(neighbours).length(8);
                expect(neighbours.find(item=>item.target.id=="1,0")?.direction).eq("NW");
                expect(neighbours.find(item=>item.target.id=="2,0")?.direction).eq("N");
                expect(neighbours.find(item=>item.target.id=="3,0")?.direction).eq("NE");
                expect(neighbours.find(item=>item.target.id=="1,1")?.direction).eq("W");
                expect(neighbours.find(item=>item.target.id=="3,1")?.direction).eq("E");
                expect(neighbours.find(item=>item.target.id=="1,2")?.direction).eq("SW");
                expect(neighbours.find(item=>item.target.id=="2,2")?.direction).eq("S");
                expect(neighbours.find(item=>item.target.id=="3,2")?.direction).eq("SE");
            })                                                
        })

        describe('paths',()=>{
            let mappy:MapSquare;
            let mappyTerrain:MapSquare;
            let mappyTerrainHeavy:MapSquare;
            const height:number =  6;
            const width:number =  5;
            let calculator:CostCalculator;
            let calculatorTerrain:CostCalculator;
            
            const CONST_COST = 1;

            beforeEach(() => {  
                mappy = new MapSquare(height, width);
                mappy.fromTiles(MapsMocks.map_6x5)
                calculator = new CostCalculatorConst(CONST_COST);

                mappyTerrain = new MapSquare(height, width);                
                mappyTerrain.fromTiles(MapsMocks.map_6x5_terrain);
                calculatorTerrain = new CostCalculatorTerrain(TerrainMocks.terrain_1);

                mappyTerrainHeavy = new MapSquare(height, width);                
                mappyTerrainHeavy.fromTiles(MapsMocks.map_6x5_terrain_heavy);
                calculatorTerrain = new CostCalculatorTerrain(TerrainMocks.terrain_1);

            });
            afterEach(() => {                  
            });

            it('origin check', () => {    
                const from:TileBase = MapsMocks.map_6x5.find((item)=>{
                    return item.id == '0,0'
                })!;
                const to:TileBase = MapsMocks.map_6x5.find((item)=>{
                    return item.id == '5,4'
                })!;
                const paths = mappy.paths(calculator, from, to); 
                return expect(paths.origin).eq(from);             
            })
            it('origin check in path to to', () => {    
                const from:TileBase = MapsMocks.map_6x5.find((item)=>{
                    return item.id == '0,0'
                })!;
                const to:TileBase = MapsMocks.map_6x5.find((item)=>{
                    return item.id == '5,4'
                })!;
                const paths = mappy.paths(calculator, from, to); 
                return expect(paths.paths.get(to)!.origin).eq(from);             
            }) 
            it('target check in path to to', () => {    
                const from:TileBase = MapsMocks.map_6x5.find((item)=>{
                    return item.id == '0,0'
                })!;
                const to:TileBase = MapsMocks.map_6x5.find((item)=>{
                    return item.id == '5,4'
                })!;
                const paths = mappy.paths(calculator, from, to); 
                const path = paths.paths.get(to);
                
                return expect(path!.target).eq(to);             
            }) 
            it('path length check', () => {    
                const from:TileBase = MapsMocks.map_6x5.find((item)=>{
                    return item.id == '0,0'
                })!;
                const to:TileBase = MapsMocks.map_6x5.find((item)=>{
                    return item.id == '5,4'
                })!;
                const paths = mappy.paths(calculator, from, to); 
                const path = paths.paths.get(to);
                
                return expect(path!.cost).eq(5);             
            }) 
            it('path steps length check', () => {    
                const from:TileBase = MapsMocks.map_6x5.find((item)=>{
                    return item.id == '0,0'
                })!;
                const to:TileBase = MapsMocks.map_6x5.find((item)=>{
                    return item.id == '5,4'
                })!;
                const paths = mappy.paths(calculator, from, to); 
                const path = paths.paths.get(to);                
                return expect(path!.steps.length).eq(6);             
            }) 

            it('terrain - path steps length check', () => {    
                const from:TileBase = MapsMocks.map_6x5_terrain.find((item)=>{
                    return item.id == '0,0'
                })!;
                const to:TileBase = MapsMocks.map_6x5_terrain.find((item)=>{
                    return item.id == '5,4'
                })!;
                const paths = mappyTerrain.paths(calculatorTerrain, from, to); 
                const path = paths.paths.get(to);                           
                return expect(path!.steps.length).eq(9);             
            }) 
            it('heavy terrain - path steps length check', () => {    
                const from:TileBase = MapsMocks.map_6x5_terrain_heavy.find((item)=>{
                    return item.id == '0,0'
                })!;
                const to:TileBase = MapsMocks.map_6x5_terrain_heavy.find((item)=>{
                    return item.id == '5,4'
                })!;
                const paths = mappyTerrainHeavy.paths(calculatorTerrain, from, to); 
                const path = paths.paths.get(to);                               
                return expect(path!.steps.length).eq(9);             
            }) 
            it('heavy terrain - cost check', () => {    
                const from:TileBase = MapsMocks.map_6x5_terrain_heavy.find((item)=>{
                    return item.id == '0,0'
                })!;
                const to:TileBase = MapsMocks.map_6x5_terrain_heavy.find((item)=>{
                    return item.id == '5,4'
                })!;
                const paths = mappyTerrainHeavy.paths(calculatorTerrain, from, to); 
                const path = paths.paths.get(to);      
                // console.log(path);          
                return expect(path!.cost).eq(14);             
            }) 

            it('heavy terrain - steps check', () => {    
                const from:TileBase = MapsMocks.map_6x5_terrain_heavy.find((item)=>{
                    return item.id == '0,0'
                })!;
                const to:TileBase = MapsMocks.map_6x5_terrain_heavy.find((item)=>{
                    return item.id == '5,4'
                })!;
                const paths = mappyTerrainHeavy.paths(calculatorTerrain, from, to); 
                const path = paths.paths.get(to);      
                const expectedPath = [
                    { id: '0,0', y: 0, x: 0, t: {kind: "PLAINS"} },
                    { id: '1,0', y: 1, x: 0, t: {kind: "PLAINS"} },
                    { id: '2,0', y: 2, x: 0, t: {kind: "MOUNTAINS"} },
                    { id: '3,0', y: 3, x: 0, t: {kind: "MOUNTAINS"} },
                    { id: '4,0', y: 4, x: 0, t: {kind: "MOUNTAINS"} },
                    { id: '5,1', y: 5, x: 1, t: {kind: "PLAINS"} },
                    { id: '5,2', y: 5, x: 2, t: {kind: "PLAINS"} },
                    { id: '5,3', y: 5, x: 3, t: {kind: "PLAINS"} },
                    { id: '5,4', y: 5, x: 4, t: {kind: "PLAINS"} }
                  ]                
                return expect(JSON.stringify(path!.steps)).eq(JSON.stringify(expectedPath));             
            })

            
        })

        describe('range', () => {   
            
            let mappyTerrainHeavy: MapBase;
            let calculatorTerrain:CostCalculator;
            const height:number =  6;
            const width:number =  5;

            beforeEach(() => {  
                mappyTerrainHeavy = new MapSquare(height, width);                
                mappyTerrainHeavy.fromTiles(MapsMocks.map_6x5_terrain_heavy);
                calculatorTerrain = new CostCalculatorTerrain(TerrainMocks.terrain_1);    
            });
            afterEach(() => {                  
            });

            it('range 1', () => { 
                const RANGE = 1;   
                const range:Paths = mappyTerrainHeavy.range(calculatorTerrain, mappyTerrainHeavy.theMap.get("0,0")!, RANGE);  
                let maxCost = 0;
                range.paths.forEach((path: Path)=>{
                    maxCost = Math.max(path.cost, maxCost);
                })                             
                return expect(maxCost).lte(RANGE)
            })   
            it('range 3', () => { 
                const RANGE = 3;   
                const range:Paths = mappyTerrainHeavy.range(calculatorTerrain, mappyTerrainHeavy.theMap.get("0,0")!, RANGE);  
                let maxCost = 0;
                range.paths.forEach((path: Path)=>{
                    maxCost = Math.max(path.cost, maxCost);
                })                             
                return expect(maxCost).lte(RANGE)
            })   
            it('range 5', () => { 
                const RANGE = 5;   
                const range:Paths = mappyTerrainHeavy.range(calculatorTerrain, mappyTerrainHeavy.theMap.get("0,0")!, RANGE);  
                let maxCost = 0;
                range.paths.forEach((path: Path)=>{
                    maxCost = Math.max(path.cost, maxCost);
                })                             
                return expect(maxCost).lte(RANGE)
            }) 

        })
        describe('distance', () => {   
            
            let mappyTerrainNoPath: MapBase;
            let calculatorTerrain:CostCalculator;
            const height:number =  6;
            const width:number =  5;

            beforeEach(() => {  
                mappyTerrainNoPath = new MapSquare(height, width);                
                mappyTerrainNoPath.fromTiles(MapsMocks.map_6x5_terrain_no_path);
                calculatorTerrain = new CostCalculatorTerrain(TerrainMocks.terrain_1);    
            });
            afterEach(() => {                  
            });

            it('distance 2', () => { 
                
                const distance:number = mappyTerrainNoPath.distance(mappyTerrainNoPath.theMap.get("0,0")!, mappyTerrainNoPath.theMap.get("1,2")!,calculatorTerrain);                
                return expect(distance).eq(2)
            })
            it('distance 11', () => { 
                
                const distance:number = mappyTerrainNoPath.distance(mappyTerrainNoPath.theMap.get("0,0")!, mappyTerrainNoPath.theMap.get("5,1")!,calculatorTerrain);                
                return expect(distance).eq(11)
            })   

            it('distance path not found', () => {                 
                return expect(()=>{mappyTerrainNoPath.distance(mappyTerrainNoPath.theMap.get("0,0")!, mappyTerrainNoPath.theMap.get("5,4")!,calculatorTerrain)}).to.throw('Path not found');                                                                      
            })   


        })
        describe('tile', () => {   
            
            let mappyTerrainNoPath: MapBase;
            const height:number =  6;
            const width:number =  5;

            beforeEach(() => {  
                mappyTerrainNoPath = new MapSquare(height, width);                
                mappyTerrainNoPath.fromTiles(MapsMocks.map_6x5_terrain_no_path);
            });
            afterEach(() => {                  
            });

            it('return tile', () => { 
                
                const tile = mappyTerrainNoPath.tile("0,0");
                const idfromxy = tile.y+","+tile.x;
                return expect(tile.id).eq(idfromxy)
            })   

            it('tile not found', () => {                 
                return expect(()=>{mappyTerrainNoPath.tile("some non existing id")}).to.throw('Tile not found');                                                                      
            })   


        })
        describe("putting tile",()=>{
            let mappy:MapSquare;
            let width:number;
            let height: number;
            beforeEach(()=>{
                width = 3;
                height = 2;
                mappy = new MapSquare(height, width);
            })
            it("replaces existing tile",()=>{
                mappy.put({
                    id: "0,0",
                    x: 0,
                    y: 0,
                    t: {kind: "UNDEFINED"}                    
                })
                mappy.put({
                    id: "1,0",
                    x: 1,
                    y: 0,
                    t: {kind: "UNDEFINED"}                    
                })
                mappy.put({
                    id: "1,0",
                    x: 0,
                    y: 0,
                    t: {kind: "OTHER"}                    
                })
                expect(mappy.tile("1,0").t.kind).eq("OTHER")
                expect(mappy.theMap.size).eq(2)
            })
            it("adds new tile",()=>{
                mappy.put({
                    id: "0,0",
                    x: 0,
                    y: 0,
                    t: {kind: "UNDEFINED"}                    
                })
                mappy.put({
                    id: "1,0",
                    x: 1,
                    y: 0,
                    t: {kind: "UNDEFINED"}                    
                })
                expect(mappy.theMap.size).eq(2)
                expect(mappy.tile("0,0").t.kind).eq("UNDEFINED")
                expect(mappy.tile("1,0").t.kind).eq("UNDEFINED")
            })            
            it("throws error when putting a tile at location not supported by map width",()=>{
                return expect(()=>{mappy.put.bind(mappy)({
                    id: "4,0",
                    x: 4,
                    y: 0,
                    t: {kind: "UNDEFINED"}                    
                })}).to.throw("violates map size");                    
            })
            it("throws error when putting a tile at negative location not supported by map width",()=>{
                return expect(()=>{mappy.put.bind(mappy)({
                    id: "-4,0",
                    x: -4,
                    y: 0,
                    t: {kind: "UNDEFINED"}                    
                })}).to.throw("violates map size");                    
            })
            it("throws error when putting a tile at location not supported by map height",()=>{
                return expect(()=>{mappy.put.bind(mappy)({
                    id: "0,3",
                    x: 0,
                    y: 3,
                    t: {kind: "UNDEFINED"}                    
                })}).to.throw("violates map size");                    
            })
            it("throws error when putting a tile at negative location not supported by map height",()=>{
                return expect(()=>{mappy.put.bind(mappy)({
                    id: "0,-1",
                    x: 0,
                    y: -1,
                    t: {kind: "UNDEFINED"}                    
                })}).to.throw("violates map size");                    
            })
        })
        
        
    })

    describe('MapHeqOddQ', () => {   
        describe('_direction', () => {   
            let mappy:MapHexOddQ;
            beforeEach(()=>{
                mappy = new MapHexOddQ(6,8)                    
            })
            
            it("odd x",()=>{
                expect(mappy._direction(new Tile(1,1,"UNDEFINED"),0,-1)).eq("N");
                expect(mappy._direction(new Tile(1,1,"UNDEFINED"),0,1)).eq("S");
                expect(mappy._direction(new Tile(1,1,"UNDEFINED"),1,0)).eq("NE");
                expect(mappy._direction(new Tile(1,1,"UNDEFINED"),-1,0)).eq("NW");
                expect(mappy._direction(new Tile(1,1,"UNDEFINED"),1,1)).eq("SE");
                expect(mappy._direction(new Tile(1,1,"UNDEFINED"),-1,1)).eq("SW");

                expect(()=>{expect(mappy._direction(new Tile(1,1,"UNDEFINED"),-2,0)).eq("NE");}).to.throw("delta must be one of -1, 0, 1")
                expect(()=>{expect(mappy._direction(new Tile(1,1,"UNDEFINED"),2,0)).eq("NE");}).to.throw("delta must be one of -1, 0, 1")
                expect(()=>{expect(mappy._direction(new Tile(1,1,"UNDEFINED"),1,-2)).eq("NE");}).to.throw("delta must be one of -1, 0, 1")
                expect(()=>{expect(mappy._direction(new Tile(1,1,"UNDEFINED"),1,2)).eq("NE");}).to.throw("delta must be one of -1, 0, 1")
                expect(()=>{expect(mappy._direction(new Tile(1,1,"UNDEFINED"),2,2)).eq("NE");}).to.throw("delta must be one of -1, 0, 1")
                expect(()=>{expect(mappy._direction(new Tile(1,1,"UNDEFINED"),-2,-2)).eq("NE");}).to.throw("delta must be one of -1, 0, 1")

            })
            it("even x",()=>{
                expect(mappy._direction(new Tile(2,1,"UNDEFINED"),0,-1)).eq("N");
                expect(mappy._direction(new Tile(2,1,"UNDEFINED"),0,1)).eq("S");
                expect(mappy._direction(new Tile(2,1,"UNDEFINED"),1,-1)).eq("NE");
                expect(mappy._direction(new Tile(2,1,"UNDEFINED"),-1,-1)).eq("NW");
                expect(mappy._direction(new Tile(2,1,"UNDEFINED"),1,0)).eq("SE");
                expect(mappy._direction(new Tile(2,1,"UNDEFINED"),-1,0)).eq("SW");

                expect(()=>{mappy._direction(new Tile(0,0,"UNDEFINED"),1,1)}).to.throw("Invalid arguments")

                expect(()=>{mappy._direction(new Tile(2,1,"UNDEFINED"),-2,0)}).to.throw("delta must be one of -1, 0, 1")
                expect(()=>{mappy._direction(new Tile(2,1,"UNDEFINED"),-1,-2)}).to.throw("delta must be one of -1, 0, 1")
                expect(()=>{mappy._direction(new Tile(2,1,"UNDEFINED"),2,0)}).to.throw("delta must be one of -1, 0, 1")
                expect(()=>{mappy._direction(new Tile(2,1,"UNDEFINED"),-1,2)}).to.throw("delta must be one of -1, 0, 1")
                expect(()=>{mappy._direction(new Tile(2,1,"UNDEFINED"),2,2)}).to.throw("delta must be one of -1, 0, 1")
                expect(()=>{mappy._direction(new Tile(2,1,"UNDEFINED"),-2,-2)}).to.throw("delta must be one of -1, 0, 1")
            })                            
        })
        
        describe('fromJson', () => {                           
            beforeEach(() => {  
                                
            });
            afterEach(() => {                  
            });

            it('map size', () => {    
                let mappy:MapHexOddQ = new MapHexOddQ(8, 5);
                mappy.fromJson(MapsFileMocks.map_8x5);
                return expect(Array.from(mappy.theMap).length).eq(40);                
            })   
            
            

            it('size check #2', () => {    
                let mappy:MapHexOddQ = new MapHexOddQ(4, 4);
                return expect(()=>{mappy.fromJson(MapsFileMocks.map_8x5)}).to.throw('Invalid arguments');                              
            }) 
            
            it('tiles array with 0 tiles', () => {    
                let mappy:MapHexOddQ = new MapHexOddQ(8, 5);
                return expect(()=>{mappy.fromJson(MapsFileMocks.map_8x5_0_tiles)}).to.throw('must contain tiles data');                              
            }) 
            it('no tiles provided', () => {    
                let mappy:MapHexOddQ = new MapHexOddQ(8, 5);
                return expect(()=>{mappy.fromJson(MapsFileMocks.map_8x5_no_tiles)}).to.throw('must contain tiles data');                              
            }) 
        })
        
        describe('neighbours', () => {   
            let mappy:MapHexOddQ;
            const width:number =  6;
            const height:number =  5;
            
            beforeEach(() => {  
                mappy = new MapHexOddQ(height, width);
                mappy.fromTiles(MapsMocks.map_6x5)
            });
            afterEach(() => {                  
            });

            it('upper left', () => {    
                const neighbours: Neighbour[] = mappy.neighbours(new Tile(0,0,"PLAINS"));                
                expect(neighbours).length(2); 
                expect(JSON.stringify(neighbours)).includes('"id":"0,1"')
                expect(JSON.stringify(neighbours)).includes('"id":"1,0"')
                expect(neighbours[0].direction).eq("SE")
                expect(neighbours[1].direction).eq("S")
            })  
            it('lower left', () => {    
                const neighbours: Neighbour[] = mappy.neighbours(new Tile(0,4,"PLAINS"));                
                expect(neighbours).length(3); 
                expect(JSON.stringify(neighbours)).includes('"id":"0,3"')
                expect(JSON.stringify(neighbours)).includes('"id":"1,3"')
                expect(JSON.stringify(neighbours)).includes('"id":"1,4"')
                expect(neighbours.find(item=>item.target.id=="0,3")?.direction).eq("N")
                expect(neighbours.find(item=>item.target.id=="1,3")?.direction).eq("NE")
                expect(neighbours.find(item=>item.target.id=="1,4")?.direction).eq("SE")
            })           
            it('upper right', () => {    
                const neighbours: Neighbour[] = mappy.neighbours(new Tile(5,0,"PLAINS"));                
                expect(neighbours).length(3);     
                expect(JSON.stringify(neighbours)).includes('"id":"4,0"')           
                expect(JSON.stringify(neighbours)).includes('"id":"4,1"')           
                expect(JSON.stringify(neighbours)).includes('"id":"5,1"')  
                expect(neighbours[0].direction).eq("NW")                         
                expect(neighbours[1].direction).eq("SW")
                expect(neighbours[2].direction).eq("S")
            }) 
            it('lower right', () => {    
                const neighbours: Neighbour[] = mappy.neighbours(new Tile(5,4,"PLAINS"));                
                expect(neighbours).length(2); 
                expect(JSON.stringify(neighbours)).includes('"id":"4,4"')
                expect(JSON.stringify(neighbours)).includes('"id":"5,3"')
                
                expect(neighbours.find(item=>item.target.id=="4,4")?.direction).eq("NW")
                expect(neighbours.find(item=>item.target.id=="5,3")?.direction).eq("N")
                
            })
            
            it('middle even', () => {    
                const neighbours: Neighbour[] = mappy.neighbours(new Tile(2,1,"PLAINS"));                
                expect(neighbours).length(6); 
                expect(JSON.stringify(neighbours)).includes('"id":"1,0"')
                expect(JSON.stringify(neighbours)).includes('"id":"2,0"')
                expect(JSON.stringify(neighbours)).includes('"id":"3,0"')
                expect(JSON.stringify(neighbours)).includes('"id":"1,1"')
                expect(JSON.stringify(neighbours)).includes('"id":"2,2"')
                expect(JSON.stringify(neighbours)).includes('"id":"3,1"')
                expect(neighbours.find(item=>item.target.id=="1,0")?.direction).eq("NW")
                expect(neighbours.find(item=>item.target.id=="2,0")?.direction).eq("N")
                expect(neighbours.find(item=>item.target.id=="3,0")?.direction).eq("NE")
                expect(neighbours.find(item=>item.target.id=="1,1")?.direction).eq("SW")
                expect(neighbours.find(item=>item.target.id=="2,2")?.direction).eq("S")
                expect(neighbours.find(item=>item.target.id=="3,1")?.direction).eq("SE")
            })

            it('middle odd', () => {    
                const neighbours: Neighbour[] = mappy.neighbours(new Tile(3,1,"PLAINS"));                
                expect(neighbours).length(6); 
                expect(JSON.stringify(neighbours)).includes('"id":"2,1"')
                expect(JSON.stringify(neighbours)).includes('"id":"3,0"')
                expect(JSON.stringify(neighbours)).includes('"id":"4,1"')
                expect(JSON.stringify(neighbours)).includes('"id":"2,2"')
                expect(JSON.stringify(neighbours)).includes('"id":"3,2"')
                expect(JSON.stringify(neighbours)).includes('"id":"4,2"')
                expect(neighbours.find(item=>item.target.id=="2,1")?.direction).eq("NW")
                expect(neighbours.find(item=>item.target.id=="3,0")?.direction).eq("N")
                expect(neighbours.find(item=>item.target.id=="4,1")?.direction).eq("NE")
                expect(neighbours.find(item=>item.target.id=="2,2")?.direction).eq("SW")
                expect(neighbours.find(item=>item.target.id=="3,2")?.direction).eq("S")
                expect(neighbours.find(item=>item.target.id=="4,2")?.direction).eq("SE")
            })            
        })  
        describe("tiles within range",()=>{
            let mappy:MapHexOddQ;
            let width:number = 6
            let height: number = 5
            let calculator:CostCalculator;
            beforeEach(()=>{                
                calculator = new CostCalculatorConst(1);
                mappy = new MapHexOddQ(height, width); 
                mappy.fromTiles(MapsMocks.map_6x5) 
            })
            it("results proper tiles #1",()=>{
                const result = mappy.tilesWithinRange(calculator, [TileMocks.tile_3_2, TileMocks.tile_2_3], 1);
                expect(result.length).eq(8);
                expect(JSON.stringify(result)).includes('"id":"3,1"')
                expect(JSON.stringify(result)).includes('"id":"4,2"')
                expect(JSON.stringify(result)).includes('"id":"4,3"')
                expect(JSON.stringify(result)).includes('"id":"3,3"')
                expect(JSON.stringify(result)).includes('"id":"2,4"')
                expect(JSON.stringify(result)).includes('"id":"1,3"')
                expect(JSON.stringify(result)).includes('"id":"1,2"')
                expect(JSON.stringify(result)).includes('"id":"2,2"')
            })
            it("results proper tiles #1",()=>{
                const result = mappy.tilesWithinRange(calculator, [TileMocks.tile_5_0, TileMocks.tile_0_4], 1);
                expect(result.length).eq(6);
                // expect(JSON.stringify(result)).includes('"id":"3,1"')
                // expect(JSON.stringify(result)).includes('"id":"4,2"')
                // expect(JSON.stringify(result)).includes('"id":"4,3"')
                // expect(JSON.stringify(result)).includes('"id":"3,3"')
                // expect(JSON.stringify(result)).includes('"id":"2,4"')
                // expect(JSON.stringify(result)).includes('"id":"1,3"')
                // expect(JSON.stringify(result)).includes('"id":"1,2"')
                // expect(JSON.stringify(result)).includes('"id":"2,2"')
            })
            it("does not contains source/from tiles",()=>{
                const result = mappy.tilesWithinRange(calculator, [TileMocks.tile_3_2, TileMocks.tile_2_3], 1);
                
                expect(JSON.stringify(result)).not.includes('id:"3,2"')
                expect(JSON.stringify(result)).not.includes('id:"2,3"')
                
            })
            it("does not contain duplicates")
            
        })      
    })

    describe('CostCalculatorConst',()=>{
        describe('cost', () => {   
           
            const CONST_COST = 1
      
            beforeEach(() => {  
                
            });
            afterEach(() => {                  
            });

            it('const cost', () => {  
                const calculator = new CostCalculatorConst(CONST_COST);
                  
                const cost = calculator.cost({id: "0,0", x: 0, y:0, t: {kind: "PLAINS"}}, {id: "1,1", x: 1, y:1, t: {kind: "PLAINS"}});
                return expect(cost).eq(CONST_COST);
                
            })

            
        })
    })
    describe('CostCalculatorTerrain',()=>{
        describe('cost', () => {   
                             
            beforeEach(() => {  
                
            });
            afterEach(() => {                  
            });

            it('plain cost', () => {  
                const terrainCost = TerrainMocks.terrain_1;
                const calculator = new CostCalculatorTerrain(terrainCost);
                  
                const cost = calculator.cost({id: "0,0", x: 0, y:0, t: {kind: "PLAINS"}}, {id: "1,1", x: 1, y:1, t: {kind: "PLAINS"}});
                return expect(cost).eq(terrainCost.PLAINS);
                
            })
            it('mountain cost', () => {  
                const terrainCost = TerrainMocks.terrain_1;
                const calculator = new CostCalculatorTerrain(terrainCost);
                  
                const cost = calculator.cost({id: "0,0", x: 0, y:0, t: {kind: "PLAINS"}}, {id: "1,1", x: 1, y:1, t: {kind: "MOUNTAINS"}});
                return expect(cost).eq(terrainCost.MOUNTAINS);
                
            })

            it('undefined cost', () => {  
                const terrainCost = TerrainMocks.terrain_1;
                const calculator = new CostCalculatorTerrain(terrainCost);                
                return expect(()=>{calculator.cost({id: "0,0", x: 0, y:0, t: {kind: "PLAINS"}}, {id: "1,1", x: 1, y:1, t: {kind: "UNDEFINED"}})}).to.throw('Invalid arguments');                 
            })

            
        })
    })

    describe('Actions',()=>{
        describe('ActionUnitLandFieldOfView',()=>{
            
            
            
            let s1:SinonStub;
            let s2:SinonStub;
            let map:MapBase = new MapSquare(6, 6);
            let messageBusMocked = new EventEmitter();
            const terrainCost = TerrainMocks.terrain_1;
                
            const tile: TileBase = {
                id: "t_1",
                t: {kind: "UNDEFINED"},
                x: 0,
                y: 0
            }

            const tile2: TileBase = {
                id: "t_2",
                t: {kind: "UNDEFINED"},
                x: 2,
                y: 2
            }
            const unit:SpecsBase&SpecsLocation = {
                uid: "u",
                actionPoints: 1,
                hitPoints: 1,
                rangeStrength: 1,
                sight:9,
                strength:1,
                tile: tile 

            }

            const pathsMap = new Map<TileBase, Path>();

            let paths: Paths;

            beforeEach(() => {  
                pathsMap.set(tile2, {
                    origin: tile,
                    target: tile2,
                    cost:1,
                    steps: []
                });

                paths = {
                    origin: tile,
                    paths: pathsMap
                }

                s1 = sinon.stub(map,'paths');
                s1.returns(paths);
                s2 = sinon.stub(messageBusMocked,'emit');
                s2.returns(undefined);

                
            });
            afterEach(() => {  
                s1.restore();                
                s2.restore();                
            });

            it('fov is limited by sight', () => {                                 
                
                const a = new ActionUnitLandFieldOfView(unit,unit,terrainCost, map, messageBus); 
                a.rangeAndCosts();
                const call = s1.getCall(0);
                return expect(call.args[1]).eq(tile)
                
            })
            it('fov is limited by sight', () => {  
                
                
                const a = new ActionUnitLandFieldOfView(unit,unit,terrainCost, map, messageBus); 
                a.rangeAndCosts();
                const call = s1.getCall(0);
                return expect(call.args[2]).is.undefined;
                
            })
            it('fov is limited by sight', () => {  
                
                
                const a = new ActionUnitLandFieldOfView(unit,unit,terrainCost, map, messageBus); 
                a.rangeAndCosts();
                const call = s1.getCall(0);
                return expect(call.args[3]).eq(unit.sight)                
            })
            it('fov event is generated', () => {  
                
                
                const a = new ActionUnitLandFieldOfView(unit,unit,terrainCost, map, messageBusMocked); 
                a.perform({});
                const call = s2.getCall(0);
                return expect(call.args[0]).eq(GameygineEvents.MAP.FOV);                
            })
            it('there are fov tiles', () => {  
                
                
                const a = new ActionUnitLandFieldOfView(unit,unit,terrainCost, map, messageBusMocked); 
                a.perform({});
                const call = s2.getCall(0);
                return expect(call.args[1][0]).eq(tile2);                
            })
            it('unit origin is also returned as fov', () => {  
                
                
                const a = new ActionUnitLandFieldOfView(unit,unit,terrainCost, map, messageBusMocked); 
                a.perform({});
                const call = s2.getCall(0);
                return expect(call.args[1][1]).eq(tile);                
            })
            it('has code set', () => {                                  
                const a = new ActionUnitLandFieldOfView(unit,unit,terrainCost, map, messageBusMocked);                 
                return expect(a.code).eq("ActionUnitLandFieldOfView");                
            })

                
            
        })
        describe('ActionUnitFortify',()=>{
            
            
            
            // let s1:SinonStub;
            let s2:SinonStub;
            
            let messageBusMocked = new EventEmitter();
            
                
            const tile: TileBase = {
                id: "t_1",
                t: {kind: "UNDEFINED"},
                x: 0,
                y: 0
            }
            const unit:SpecsBase&SpecsLocation = {
                uid: "u",
                actionPoints: 4,
                hitPoints: 1,
                rangeStrength: 1,
                sight:9,
                strength:1,
                tile: tile 

            }

            const unit2:SpecsBase&SpecsLocation = {
                uid: "u",
                actionPoints: 0,
                hitPoints: 1,
                rangeStrength: 1,
                sight:9,
                strength:1,
                tile: tile 

            }
            

            beforeEach(() => {  
                

                s2 = sinon.stub(messageBusMocked,'emit');
                s2.returns(undefined);

                
            });
            afterEach(() => {  
                              
                s2.restore();                
            });

            it('fortification is built on the unit origin tile', () => {                                 
                
                const a = new ActionUnitFortify(unit,unit,messageBus); 
                const paths = a.rangeAndCosts();                 
                return expect(paths.origin).eq(tile)                
            })
            
            it('fortification is built on the unit origin tile', () => {                                 
                
                const a = new ActionUnitFortify(unit,unit,messageBus); 
                const paths = a.rangeAndCosts();                 
                
                return expect(paths.paths.get(tile)!.origin).eq(tile)                
            })
            it('fortification is built on the unit origin tile', () => {                                 
                
                const a = new ActionUnitFortify(unit,unit,messageBus); 
                const paths = a.rangeAndCosts();                 
                
                return expect(paths.paths.get(tile)!.target).eq(tile)                
            })
            it('fortification consumes all action points', () => {                                 
                
                const a = new ActionUnitFortify(unit,unit,messageBus); 
                const paths = a.rangeAndCosts();                 
                
                return expect(paths.paths.get(tile)!.cost).eq(unit.actionPoints)                
            })
            it('fortification consumes all action points', () => {                                 
                
                const a = new ActionUnitFortify(unit2,unit2,messageBus); 
                const paths = a.rangeAndCosts();                 
                
                return expect(paths.paths.get(tile)!.cost).eq(1)                
            })

            it('fortification consumes all action points', () => {                                 
                
                const a = new ActionUnitFortify(unit2,unit2,messageBus); 
                const cost = a._actionCost();                 
                
                return expect(cost).eq(1)                
            })

            it('fortification consumes all action points', () => {                                 
                
                const a = new ActionUnitFortify(unit,unit,messageBus); 
                const cost = a._actionCost();                 
                
                return expect(cost).eq(unit.actionPoints)                
            })

            it('fortification consumes all action points', () => {                                 
                
                const a = new ActionUnitFortify(unit2,unit2,messageBusMocked); 
                a.perform();                 
                const call = s2.getCall(0);

                return expect(call.args[0]).eq(GameygineEvents.UNIT.RUNNER_ACTION)                
            })

            it('fortification consumes all action points', () => {                                 
                
                const a = new ActionUnitFortify(unit2,unit2,messageBusMocked); 
                a.perform();                 
                const call = s2.getCall(1);

                return expect(call.args[0]).eq(GameygineEvents.UNIT.CONSUME_AP)                
            })
            it('has code set', () => {                                                 
                const a = new ActionUnitFortify(unit2,unit2,messageBusMocked); 
                return expect(a.code).eq("ActionUnitFortify")                
            })
                
            
        })
        describe('ActionUnitAttack',()=>{
            
            
            
            // let s1:SinonStub;
            let s2:SinonStub;
            
            let s1:SinonStub;

            let s3:SinonStub;
            
            let map:MapBase = new MapSquare(6, 6);
            let mapNoPath:MapBase = new MapSquare(6, 6);
            
            const terrainCost = TerrainMocks.terrain_1;
            let messageBusMocked = new EventEmitter();
            
                
            const tile: TileBase = {
                id: "t_1",
                t: {kind: "UNDEFINED"},
                x: 0,
                y: 0
            }
            const tile2: TileBase = {
                id: "t_2",
                t: {kind: "UNDEFINED"},
                x: 2,
                y: 2
            }
            const tile3: TileBase = {
                id: "t_3",
                t: {kind: "UNDEFINED"},
                x: 1,
                y: 1
            }
            const unit:SpecsBase&SpecsLocation = {
                uid: "u",
                actionPoints: 4,
                hitPoints: 1,
                rangeStrength: 1,
                sight:9,
                strength:1,
                tile: tile 

            }

            const unit2:SpecsBase&SpecsLocation = {
                uid: "u",
                actionPoints: 0,
                hitPoints: 1,
                rangeStrength: 1,
                sight:9,
                strength:1,
                tile: tile2

            }

            const pathsMap = new Map<TileBase, Path>();
            const pathsMapNoPath = new Map<TileBase, Path>();
            let paths: Paths;

            let pathsNoPath: Paths;

            let actionContext1:ActionContextUnitAttack;

            beforeEach(() => {  

                actionContext1 = {
                    target: unit2,
                    targetTile: tile2
                }

                pathsMap.set(tile2, {
                    origin: tile,
                    target: tile2,
                    cost:1,
                    steps: [tile3, tile2]
                });
    
                paths = {
                    origin: tile,
                    paths: pathsMap
                }

                pathsMapNoPath.set(tile3, {
                    origin: tile,
                    target: tile3,
                    cost:1,
                    steps: [tile3]
                });

                pathsNoPath = {
                    origin: tile,
                    paths: pathsMapNoPath
                }
    
                s1 = sinon.stub(map,'paths');
                s1.returns(paths);
                s2 = sinon.stub(messageBusMocked,'emit');
                s2.returns(undefined);
                s3 = sinon.stub(mapNoPath,'paths');
                s3.returns(pathsNoPath);

                
            });
            afterEach(() => {  
                s1.restore();           
                s2.restore();   
                s3.restore();             
            });

            it('attack range is calculated', () => {                                 
                
                const a = new ActionUnitAttack(unit,unit,terrainCost, map, messageBusMocked); 
                a.rangeAndCosts();
                const call = s1.getCall(0);
                return expect(call.args[1]).eq(tile)
                
            })
            it('attack range is calculated', () => {                                 
                
                const a = new ActionUnitAttack(unit,unit,terrainCost, map, messageBusMocked); 
                a.rangeAndCosts();
                const call = s1.getCall(0);
                return expect(call.args[3]).eq(unit.actionPoints)
                
            })
            it('moves attacker near target', () => {                                 
                
                const a = new ActionUnitAttack(unit,unit,terrainCost, map, messageBusMocked); 
                a.perform(actionContext1);
                const call = s2.getCall(0);
                return expect(call.args[2]).eq(tile3)
                
            })
            it('moves attacker near target', () => {                                 
                
                const a = new ActionUnitAttack(unit,unit,terrainCost, map, messageBusMocked); 
                a.perform(actionContext1);
                const call = s2.getCall(0);
                return expect(call.args[0]).eq(GameygineEvents.UNIT.POSITION)
                
            })
            it('moves attacker near target', () => {                                 
                
                const a = new ActionUnitAttack(unit,unit,terrainCost, map, messageBusMocked); 
                a.perform(actionContext1);
                const call = s2.getCall(0);
                return expect(call.args[1]).eq(unit)
                
            })
            it('throws exception when no path found', () => {                                 
                
                const a = new ActionUnitAttack(unit,unit,terrainCost, mapNoPath, messageBusMocked); 
                

                return expect(()=>{a.perform(actionContext1)}).to.throw('Path not found');                                      
                
                
            })
            it('has action code set', () => {                                                 
                const a = new ActionUnitAttack(unit,unit,terrainCost, mapNoPath, messageBusMocked);                 
                return expect(a.code).eq("ActionUnitAttack")                                      
            })

           
                
            
        })
        describe('ActionUnitMove',()=>{
            
            
            
            // let s1:SinonStub;
            let s2:SinonStub;
            
            let s1:SinonStub;

            let s3:SinonStub;
            
            let map:MapBase = new MapSquare(6, 6);
            let mapNoPath:MapBase = new MapSquare(6, 6);
            
            const terrainCost = TerrainMocks.terrain_1;
            let messageBusMocked = new EventEmitter();
            
                
            const tile: TileBase = {
                id: "t_1",
                t: {kind: "UNDEFINED"},
                x: 0,
                y: 0
            }
            const tile2: TileBase = {
                id: "t_2",
                t: {kind: "UNDEFINED"},
                x: 2,
                y: 2
            }
            const tile3: TileBase = {
                id: "t_3",
                t: {kind: "UNDEFINED"},
                x: 1,
                y: 1
            }
            const unit:SpecsBase&SpecsLocation = {
                uid: "u",
                actionPoints: 4,
                hitPoints: 1,
                rangeStrength: 1,
                sight:9,
                strength:1,
                tile: tile 

            }



            const pathsMap = new Map<TileBase, Path>();
            const pathsMapNoPath = new Map<TileBase, Path>();
            let paths: Paths;

            let pathsNoPath: Paths;

            let actionContext1:ActionContextUnitMove;

            beforeEach(() => {  

                actionContext1 = {                    
                    to: tile2
                }

                pathsMap.set(tile2, {
                    origin: tile,
                    target: tile2,
                    cost:1,
                    steps: [tile3, tile2]
                });
    
                paths = {
                    origin: tile,
                    paths: pathsMap
                }

                pathsMapNoPath.set(tile3, {
                    origin: tile,
                    target: tile3,
                    cost:1,
                    steps: [tile3]
                });

                pathsNoPath = {
                    origin: tile,
                    paths: pathsMapNoPath
                }
    
                s1 = sinon.stub(map,'paths');
                s1.returns(paths);
                s2 = sinon.stub(messageBusMocked,'emit');
                s2.returns(undefined);
                s3 = sinon.stub(mapNoPath,'paths');
                s3.returns(pathsNoPath);

                
            });
            afterEach(() => {  
                s1.restore();           
                s2.restore();   
                s3.restore();             
            });

            it('move range is calculated', () => {                                 
                
                const a = new ActionUnitMove(unit,unit,terrainCost, map, messageBusMocked); 
                a.rangeAndCosts();
                const call = s1.getCall(0);
                return expect(call.args[1]).eq(tile)
                
            })
            it('move range is calculated', () => {                                 
                
                const a = new ActionUnitMove(unit,unit,terrainCost, map, messageBusMocked); 
                a.rangeAndCosts();
                const call = s1.getCall(0);
                return expect(call.args[3]).eq(unit.actionPoints)
                
            })
            it('moves to destination tile', () => {                                 
                
                const a = new ActionUnitMove(unit,unit,terrainCost, map, messageBusMocked); 
                a.perform(actionContext1);
                const call = s2.getCall(0);
                return expect(call.args[2]).eq(tile2)
                
            })
            it('moves to destination tile', () => {                                 
                
                const a = new ActionUnitMove(unit,unit,terrainCost, map, messageBusMocked); 
                a.perform(actionContext1);
                const call = s2.getCall(0);
                return expect(call.args[0]).eq(GameygineEvents.UNIT.POSITION)
                
            })
            it('moves to destination tile', () => {                                 
                
                const a = new ActionUnitMove(unit,unit,terrainCost, map, messageBusMocked); 
                a.perform(actionContext1);
                const call = s2.getCall(0);
                return expect(call.args[1]).eq(unit)
                
            })
            it('throws exception when no path found', () => {                                 
                
                const a = new ActionUnitMove(unit,unit,terrainCost, mapNoPath, messageBusMocked); 
                

                return expect(()=>{a.perform(actionContext1)}).to.throw('Path not found');                                      
                
                
            })

            it('consumes action points accordingly', () => {                                 
                
                const a = new ActionUnitMove(unit,unit,terrainCost, map, messageBusMocked); 
                a.perform(actionContext1);
                const call = s2.getCall(1);
                return expect(call.args[1]).eq(unit)
                
            })
            it('consumes action points accordingly', () => {                                 
                
                const a = new ActionUnitMove(unit,unit,terrainCost, map, messageBusMocked); 
                a.perform(actionContext1);
                const call = s2.getCall(1);
                return expect(call.args[0]).eq(GameygineEvents.UNIT.CONSUME_AP)
                
            })
            it('consumes action points accordingly', () => {                                 
                
                const a = new ActionUnitMove(unit,unit,terrainCost, map, messageBusMocked); 
                const paths = a.rangeAndCosts();
                const path = paths.paths.get(actionContext1.to);
                a.perform(actionContext1);
                const call = s2.getCall(1);
                return expect(call.args[2]).eq(path!.cost)
                
            })
            it('has action code set', () => {                                                 
                const a = new ActionUnitMove(unit,unit,terrainCost, map, messageBusMocked); 
                return expect(a.code).eq("ActionUnitMove")                
            })

           
                
            
        })
        
    })
    describe("Utils",()=>{
        it("parses qr string to x,y object",()=>{
            const xy = Utils.qrStringToTileXY("3,1");

            expect(xy.x).eq(3);
            expect(xy.y).eq(1);
        })
    })
})


