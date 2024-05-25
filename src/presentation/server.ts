import express, { Router } from 'express'

interface Options {
  port:number,
  routes: Router;
  public_path?: string
}

export class Server {

  private app = express();
  private readonly port: number;
  private readonly publicpath: string;
  private readonly routes: Router;

  constructor(options: Options){
    const {port, public_path = 'public', routes} = options
    this.port = port;
    this.publicpath = public_path
    this.routes = routes
  }

  async start() {

    //* Middlewares
    this.app.use(express.json())//raw
    this.app.use(express.urlencoded({extended: true}))//x-wwww-form-urlencoded

    //* Public folder

    //* Routes
    this.app.use(this.routes)

    
    this.app.listen(this.port, () => {
      console.log(`Server running on port: ${this.port}`)
    })

  }
}