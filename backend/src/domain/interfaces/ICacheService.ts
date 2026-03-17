
export interface ICacheService {
    set(key: string, value: string, ttlSeconds?: number): Promise<void>;
    get(key: string): Promise<string | null>;
    delete(key: string): Promise<void>;

    setNX(key:string,value:string | number):Promise<boolean>;
    increment(key:string,amount:number):Promise<number>;
    getNumber(key:string):Promise<number | null>
}