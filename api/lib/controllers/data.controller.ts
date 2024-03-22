import Controller from "interfaces/controller.interface";
import { Request, Response, NextFunction, Router } from "express";
import path = require("path");

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
        
        this.router.get(`${this.path}/:id`, this.getData);

        this.router.get(`${this.path}/:id/latest`, this.getLatestData);

        this.router.get(`${this.path}/:id/:num`, this.getRange);

        this.router.delete(`${this.path}/all`, this.deleteAll);

        this.router.delete(`${this.path}/:id`, this.deleteElem);
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

    private getData = async (request: Request, response: Response, next: NextFunction) => {
        const {id} = request.params;
        const data = testArr;

        response.status(200).json(data[Number(id)]);
    }

    private getLatestData = async (request: Request, response: Response, next: NextFunction) => {
        const {id} = request.params;
        const data = testArr;
        const max = data.reduce((a, b) => Math.max(a, b), -Infinity);

        response.status(200).json(max);

    }

    private getRange = async (request: Request, response: Response, next: NextFunction) => {
        const {id} = request.params;
        const {num} = request.params;
        const data = testArr;

        response.status(200).json(data.splice(Number(id), Number(num)));
    }

    private deleteAll = async (request: Request, response: Response, next: NextFunction) => {
        testArr = [];
        response.status(200).json(`Wyczyszczono tablice`);
    }

    private deleteElem = async (request: Request, response: Response, next: NextFunction) => {
        const {id} = request.params;

        testArr.splice(Number(id), 1)
        
        response.status(200).json(`Usunięto element o indeksie ${id}`);
    }

}

export default DataController;