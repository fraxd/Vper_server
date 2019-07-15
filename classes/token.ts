import jwt from 'jsonwebtoken'




export default class Token {

    private static seed: string = 'pencalabs';
    private static caducidad: string = '30d';

    constructor( ){}

    static getJwtToken( payload: any): string {

        return jwt.sign( {
            usuario: payload
        }, this.seed, { expiresIn: this.caducidad} );

    }




    static comprobarToken( userToken: string){

        return new Promise (( resolve, reject) => {
            jwt.verify(userToken, this.seed, (err , decoded) => {
                if( err){
                    // NO CONFIAR
                    reject();
                } else{
                    // token valiado
                    resolve( decoded);
                }
    
            })
        })

      

    }

}