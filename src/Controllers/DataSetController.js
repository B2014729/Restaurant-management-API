import dataset_revuene from "../Services/dataset_revuene.js";

// const get_day_in_month = (year, month) => {
//     return new Date(year, month, 0).getDate();
// }

// const get_Sunday_in_month = (year, month) => {
//     let daysInMonth = get_day_in_month(year, month);

//     let numHolidays = 0;
//     for (let i = 1; i <= daysInMonth; i++) {
//         let dayOfWeek = new Date(year, month - 1, i).getDay();
//         if (dayOfWeek === 6) {
//             numHolidays++;
//         }
//     }

//     return numHolidays;
// }

// const get_event_in_month = (month) => {
//     switch (month) {
//         case 1:
//             return {
//                 eventDate: 1,
//                 weather: 'sunny'
//             };
//         case 2:
//             return {
//                 eventDate: 1,
//                 weather: 'sunny'
//             };
//         case 3:
//             return {
//                 eventDate: 1,
//                 weather: 'sunny'
//             };
//         case 4:
//             return {
//                 eventDate: 1,
//                 weather: 'cool'
//             };
//         case 5:
//             return {
//                 eventDate: 1,
//                 weather: 'cool'
//             };
//         case 6:
//             return {
//                 eventDate: 1,
//                 weather: 'rain'
//             };
//         case 7:
//             return {
//                 eventDate: 0,
//                 weather: 'rain'
//             };
//         case 8:
//             return {
//                 eventDate: 1,
//                 weather: 'rain'
//             };
//         case 9:
//             return {
//                 eventDate: 0,
//                 weather: 'rain'
//             };
//         case 10:
//             return {
//                 eventDate: 1,
//                 weather: 'rain'
//             };
//         case 11:
//             return {
//                 eventDate: 1,
//                 weather: 'sunny'
//             };
//         case 12:
//             return {
//                 eventDate: 1,
//                 weather: 'sunny'
//             };
//     }
// }

// const get_discount = () => {
//     return Math.floor(Math.random() * 50);
// }

// const get_advertisement = () => {
//     return Math.floor(Math.random() * (15000000 - 5000000)) + 5000000;
// }

// const get_revenue = (numHolidays, payAdvertisement, weather, discount) => {
//     if (numHolidays >= 6) {
//         if (payAdvertisement >= 10000000) {
//             if (weather === 'sunny') {
//                 return Math.floor(Math.random() * (140000000 - 150000000)) + 140000000;
//             } else {
//                 return Math.floor(Math.random() * (130000000 - 140000000)) + 130000000;
//             }
//         } else {
//             if (weather === 'sunny') {
//                 return Math.floor(Math.random() * (130000000 - 140000000)) + 130000000;
//             } else {
//                 return Math.floor(Math.random() * (110000000 - 120000000)) + 110000000;
//             }
//         }
//     } else {
//         if (payAdvertisement >= 9000000) {
//             if (weather === 'sunny') {
//                 return Math.floor(Math.random() * (120000000 - 130000000)) + 120000000;
//             } else {
//                 return Math.floor(Math.random() * (115000000 - 125000000)) + 115000000;
//             }
//         } else {
//             if (weather === 'sunny') {
//                 return Math.floor(Math.random() * (115000000 - 125000000)) + 115000000;
//             } else {
//                 return Math.floor(Math.random() * (100000000 - 115000000)) + 100000000;
//             }
//         }
//     }
// }

const GetAll = async (req, res) => {
    return res.send('Hello world');
}

// const CreateDataSet = async (req, res) => {
//     for (let year = 2014; year < 2023; year++) {
//         for (let month = 1; month <= 12; month++) {
//             let quantityDate = get_day_in_month(year, month);
//             let { eventDate, weather } = get_event_in_month(month);
//             let quantitySunday = get_Sunday_in_month(year, month);
//             let discount = get_discount();
//             let advertisement = get_advertisement();
//             let revenue = get_revenue((eventDate + quantityDate), advertisement, weather);

//             let data = {
//                 month: month,
//                 quantityDate: quantityDate,
//                 eventDate: eventDate,
//                 weather: weather,
//                 quantitySunday: quantitySunday,
//                 advertisement: advertisement,
//                 discount: discount,
//                 revenue: revenue,
//             }
//             let result = await dataset_revuene.Create(data);
//         }
//     }
// }


export {
    GetAll,
    //CreateDataSet
}