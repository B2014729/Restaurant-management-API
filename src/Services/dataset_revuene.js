import connection from "../Configs/ConnectDB.js";

class DatasetRevueneService {
    async FindAll() {
        try {
            let [resultQuery, field] = await connection.execute("SELECT * FROM dataset_revenue");
            return resultQuery;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async Create(dataRow) {
        let { month, quantityDay, numHolidays, quantitySunDay, discount, advertisement, weather, revenue, quantity } = dataRow;
        // console.log(month, quantityDay, numHolidays, quantitySunDay, discount, advertisement, weather, revenue, quantity);
        try {
            await connection.execute("INSERT INTO `dataset_revenue`(`thang`, `songay`, `songayle`, `songayCN`, `giamgia`, `chiphiquangcao`, `thoitiet`, `doanhthu`, `songaykhuyenmai`) VALUES (?,?,?,?,?,?,?,?,?)", [month, quantityDay, numHolidays, quantitySunDay, discount, advertisement, weather, revenue, quantity]);
            let [dataAdd, field] = await connection.execute("SELECT * FROM dataset_revenue ORDER BY stt DESC LIMIT 1;");
            if (dataAdd.length > 0) {
                return dataAdd;
            }
            return [];
        } catch (error) {
            console.log(error);
            return [];
        }
    }
}

export default new DatasetRevueneService();
