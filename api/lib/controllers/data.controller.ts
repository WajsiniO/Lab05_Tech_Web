import Controller from "interfaces/controller.interface";
import { Request, Response, NextFunction, Router } from "express";
import path = require("path");
import { checkIdParam } from "../middlewares/deviceIdParam.middleware";
import DataService from "../modules/services/data.service";
import Joi = require("joi");
import bodyParser = require("body-parser");


let testArr =
[4,5,6,3,5,3,7,5,13,5,6,4,3,6,3,6];

class DataController implements Controller {
    public path = '/api/data';
    public router = Router();
    public dataService = new DataService();
    
    constructor() {
        this.initializeRoutes();
        
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/latest`,
        this.getLatestReadingsFromAllDevices);
        
        this.router.get(`${this.path}/getDeviceData`,
        this.getAllDeviceData);

        this.router.post(`${this.path}/:id`, checkIdParam, this.addData);
        
       // this.router.get(`${this.path}/:id`, checkIdParam,this.getData);

        this.router.get(`${this.path}/:id/latest`, checkIdParam,this.getLatestData);

        this.router.get(`${this.path}/:id/:num`, checkIdParam,this.getRange);

        this.router.delete(`${this.path}/all`, this.deleteAll);

        this.router.delete(`${this.path}/:id`, checkIdParam,this.deleteElem);
    }

    private getLatestReadingsFromAllDevices = async (request: Request, response: Response, next: NextFunction) => {
        const data = testArr;

        response.status(200).json(data);
    }

    private getAllDeviceData = async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;
        const allData = await this.dataService.query(id);
        response.status(200).json(allData);
     };
     
     private addData = async (request: Request, response: Response, next: NextFunction) => {
        const { air } = request.body;
        const { id } = request.params;

        const schema = Joi.object({
            air: Joi.array()
                .items(
                    Joi.object({
                        id: Joi.number().integer().positive().required(),
                        value: Joi.number().positive().required()
                    })
                )
                .unique((a, b) => a.id === b.id),
            deviceId: Joi.number().integer().positive().valid(parseInt(id,10)).required()
        });
     
        const data = {
            temperature: air[0].value,
            pressure: air[1].value,
            humidity: air[2].value,
            deviceId: parseInt(id, 10)
        }
       
        try {
           
            await this.dataService.createData(data);
            response.status(200).json(data);
        } catch (error) {
            console.error(`Validation Error: ${error.message}`);
            response.status(400).json({ error: 'Invalid input data.' });
        }
     };
     
     

   /* private getData = async (request: Request, response: Response, next: NextFunction) => {
        const { air } = request.body;
        const { id } = request.params;
     
        const data = {
            temperature: air[0].value,
            pressure: air[1].value,
            humidity: air[2].value,
            deviceId: parseInt(id, 10)
        }
        try {
           
            await this.dataService.get(data, Number(id));
            response.status(200).json(data);
        } catch (error) {
            console.error(`Validation Error: ${error.message}`);
            response.status(400).json({ error: 'Invalid input data.' });
        }

    }
*/
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