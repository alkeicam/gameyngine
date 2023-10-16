export class Utils {
    static deepMerge(a:any, b:any, fn:(key: string, a:any, b:any)=>void){
        return [...new Set([...Object.keys(a), ...Object.keys(b)])]
        .reduce(
            (acc, key) => ({ ...acc, [key]: fn(key, a[key], b[key]) }),
            {}
          );
    }  
    
    static qrStringToTileXY(qr: string):{x: number, y: number}{
        const splitted = qr.split(",");
        return {
            x: parseInt(splitted[0]), // q=>x
            y: parseInt(splitted[1]) // r=>y
        }
    }
}