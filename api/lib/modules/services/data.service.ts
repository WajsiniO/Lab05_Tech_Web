import DataModel from '../schemas/data.schema';
import {IData, Query} from "../models/data.model";

export default class DataService {

public async createData(dataParams: IData) {
   try {
       const dataModel = new DataModel(dataParams);
       await dataModel.save();
   } catch (error) {
       console.error('Wystąpił błąd podczas tworzenia danych:', error);
       throw new Error('Wystąpił błąd podczas tworzenia danych');
   }
}

public async query(deviceID: string) {
   try {
       const data = await DataModel.find({deviceId: deviceID}, { __v: 0, _id: 0 });
       return data;
    } catch (error) {
        throw new Error(`Query failed: ${error}`);
    }
 }

 public async get(deviceID: IData, limit: number){
    try {
        const getData = DataModel.find({deviceId: deviceID}, {__v: 0, __id: 0}).limit(limit).sort({$natural:-1});
        return getData;
    } catch (error){
        throw new Error(`Couldn't find data`);
    }
 }

 /*public async getAllDevices(){
    await Promise.all(
        Array.from({ length: 17 }, async (_, i) => {
            try {
                const latestEntry = await DataModel.find({ deviceId: i  }, { __v: 0, _id: 0 }).limit(1).sort({$natural:-1});
                // console.log(latestEntry)
                if (latestEntry.length) {
                    latestData.push(latestEntry[0]);
                } else {
                    latestData.push({deviceId: i});
                }
            } catch (error) {
                console.error(`Błąd podczas pobierania danych dla urządzenia ${i + 1}: ${error.message}`);
                latestData.push({});
            }
        })
     );
     
 }

*/
public async deleteData(id: string){
    try {
        await DataModel.deleteMany({deviceId: id});
    } catch (error){
        throw new Error(`Couldn't delete data`);
    }
}

 }
 