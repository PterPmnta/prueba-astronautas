export interface GetProductByUserIdInterface {
    execute(userId: string): Promise<any>;
}
