import Controller from "interfaces/controller.interface";
import { Request, Response, NextFunction, Router } from "express";

let testArr =
[4,5,6,3,5,3,7,5,13,5,6,4,3,6,3,6];

class DataController implements Controller {
    public path = '/api/data';
    public router = Router();
    
    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/latest`,
        this.getLatestReadingsFromAllDevices);
        this.router.post(`${this.path}/:id`, this.addData);
    }

    private getLatestReadingsFromAllDevices = async (request: Request, response: Response, next: NextFunction) => {
        const data = testArr;

        response.status(200).json(data);
    }

    private addData = async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;
        testArr.push(Number(id));

        response.status(200).json(`Dodano ${id}`);
    }
}

export default DataController;