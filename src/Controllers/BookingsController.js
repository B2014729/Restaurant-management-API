import BookingsService from "../Services/BookingsService.js";
import CustomerService from "../Services/CustomerService.js";
import FormatResponseJson from "../Services/FotmatResponse.js";

import * as JWT from '../Services/JWTService.js';

const GetBookings = async (req, res) => {
    let id = req.params.id;
    if (!id) {
        return res.status(404).json(FormatResponseJson(404, "Id is not empty!", []));
    } else {
        id = Number(id);
        if (isNaN(id)) {
            return res.status(404).json(FormatResponseJson(404, "Id is not Number", []));
        }
    }
    try {
        let bookings = await BookingsService.FindOneById(id);
        if (bookings.length <= 0) {
            return res.status(400).json(FormatResponseJson(400, `Not found bookings id ${id}`, []));
        }

        let customerInfo = await CustomerService.FindOneById(bookings[0].idkhachhang);
        delete bookings[0].idkhachhang;
        bookings[0].thongtinkhachhang = customerInfo[0];

        return res.status(200).json(FormatResponseJson(200, "Successful", bookings));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error", []));
    }
}

const GetBookingsList = async (req, res) => {
    try {
        let bookingsList = await BookingsService.FindAll();
        if (bookingsList.length !== 0) {
            for (let i = 0; i < bookingsList.length; i++) {
                let customerInfo = await CustomerService.FindOneById(bookingsList[i].idkhachhang);
                delete bookingsList[i].idkhachhang;
                bookingsList[i].thongtinkhachhang = customerInfo[0];
            }
            return res.status(200).json(FormatResponseJson(200, "Successful", bookingsList));
        }
        return res.status(400).json(FormatResponseJson(400, "Dose not exist bookings", []));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error!", []));
    }
}

const GetBookingsWithTable = async (req, res) => {
    let idTable = req.params.idTable;
    try {
        let bookingsList = await BookingsService.FindAllByIdTable(idTable);
        if (bookingsList.length !== 0) {
            for (let i = 0; i < bookingsList.length; i++) {
                let customerInfo = await CustomerService.FindOneById(bookingsList[i].idkhachhang);
                delete bookingsList[i].idkhachhang;
                bookingsList[i].thongtinkhachhang = customerInfo[0];
            }
            return res.status(200).json(FormatResponseJson(200, "Successful", bookingsList));
        }
        return res.status(400).json(FormatResponseJson(400, "Dose not exist bookings", []));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error!", []));
    }
}

const GetBookingsWithIdCustomer = async (req, res) => {
    let token = req.params.token;//id is id customer
    if (!token) {
        return res.status(404).json(FormatResponseJson(404, "Id is not empty!", []));
    }

    let id = JWT.getUserIdFromToken(token);

    id = Number(id);
    if (isNaN(id)) {
        return res.status(404).json(FormatResponseJson(404, "Id is not Number", []));
    }

    try {
        let bookings = await BookingsService.FindAllWithIdCustomer(id);
        if (bookings.length <= 0) {
            return res.status(400).json(FormatResponseJson(400, `Not found bookings id ${id}`, []));
        }
        let dataAfterFormat = {};

        let customerInfo = await CustomerService.FindOneById(id);
        dataAfterFormat.thongtinkhachhang = customerInfo[0];

        bookings.forEach(element => {
            delete element.idkhachhang;
        });
        dataAfterFormat.thongtindatban = bookings;


        return res.status(200).json(FormatResponseJson(200, "Successful", dataAfterFormat));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error", []));
    }
}

const NewBookings = async (req, res) => {
    let bookingsNew = req.body;
    if (!bookingsNew.quantity || !bookingsNew.date || !bookingsNew.time || !bookingsNew.phone) {
        return res.status(401).json(FormatResponseJson(401, "Invalid data, please check again!", []));
    }

    //Dat ban phai do khach hang tao => token != ''
    //Hoac dat ban do nhan vien tao => staff != 1 (staff = token cua nhan vien);
    if (!bookingsNew.token && (bookingsNew.staff == 1)) {
        return res.status(401).json(FormatResponseJson(401, "Invalid token and staff, please check again!", []));
    }

    let dataFormat = {};
    try {
        // Khach hang tu dat ban
        if (bookingsNew.token != '' && bookingsNew.staff == 1) {
            dataFormat = {
                idCustomer: JWT.getUserIdFromToken(bookingsNew.token),
                dateTime: bookingsNew.date + " " + bookingsNew.time,
                quantityUser: bookingsNew.quantity,
                name: bookingsNew.name,
                phone: bookingsNew.phone,
                note: bookingsNew.note ? bookingsNew.note : '',
                staff: 1,
            };
        } else {
            //Nhan vien tao dat ban =>check khach hang co trong he thong chua
            if (bookingsNew.token == '' && bookingsNew.staff != 1) {
                let listCustomer = await CustomerService.FindAll();
                let issetCustomer = {};
                listCustomer.forEach(element => {
                    if (element.sodienthoai == bookingsNew.phone) {
                        issetCustomer = element;
                    }
                });

                //Khach hang da co trong he thong
                if (Object.keys(issetCustomer).length != 0) {
                    dataFormat = {
                        idCustomer: issetCustomer.idkhachhang,
                        dateTime: bookingsNew.date + " " + bookingsNew.time,
                        quantityUser: bookingsNew.quantity,
                        name: bookingsNew.name,
                        phone: bookingsNew.phone,
                        note: bookingsNew.note ? bookingsNew.note : '',
                        staff: JWT.getUserIdFromToken(bookingsNew.staff),
                    };
                } else {
                    //Khach hang chua co trong he thong  =>  Tao khach hang moi
                    let username = bookingsNew.name.replace(' ', '');
                    let customerNew = await CustomerService.Create({
                        name: bookingsNew.name,
                        phone: bookingsNew.phone,
                        username: username,
                        password: '123',
                    });

                    if (!customerNew || customerNew.length == 0) {
                        return res.status(401).json(FormatResponseJson(401, "Create customer error!", []));
                    }

                    dataFormat = {
                        idCustomer: customerNew[0].idkhachhang,
                        dateTime: bookingsNew.date + " " + bookingsNew.time,
                        quantityUser: bookingsNew.quantity,
                        name: bookingsNew.name,
                        phone: bookingsNew.phone,
                        note: bookingsNew.note ? bookingsNew.note : '',
                        staff: JWT.getUserIdFromToken(bookingsNew.staff),
                    };
                }
            } else {
                return res.status(401).json(FormatResponseJson(401, "Invalid data, please check again!", []));
            }
        }
        let result = await BookingsService.Create(dataFormat);

        if (result.length > 0) {
            // bookingSuccess
            req.io.emit('bookingSuccess');
            return res.status(200).json(FormatResponseJson(200, "Create dish successful!", result));
        }
        return res.status(401).json(FormatResponseJson(401, "Create dish failed!", []));
    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error!", []));
    }
}

const UpdateBookings = async (req, res) => {
    let idBookings = req.params.id;
    let updateBookings = req.body;
    if (!updateBookings.idCustomer || !updateBookings.quantityUser || !updateBookings.dateTime || !updateBookings.status) {
        return res.status(401).json(FormatResponseJson(401, "Invalid data, please check again!", []));
    }

    if (!idBookings) {
        return res.status(404).json(FormatResponseJson(404, "Id is not empty!", []));
    } else {
        idBookings = Number(idBookings);
        if (isNaN(idBookings)) {
            return res.status(404).json(FormatResponseJson(404, "Id is not Number", []));
        }
    }

    try {
        let result = await BookingsService.Update(idBookings, updateBookings);
        if (!result || result.length === 0) {
            return res.status(401).json(FormatResponseJson(401, "Update bookings failed!", []));
        }
        return res.status(200).json(FormatResponseJson(200, "Updated bookings successful!", [result]));

    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error!", []));
    }
}

const ConfirmBooking = async (req, res) => {
    let idBookings = req.params.id;
    let confirmBooking = req.body;
    if (!confirmBooking.idTable || (confirmBooking.idTable < 10 || confirmBooking.idTable > 29)) {
        return res.status(401).json(FormatResponseJson(401, "Invalid data, please check again!", []));
    }

    if (!idBookings) {
        return res.status(404).json(FormatResponseJson(404, "Id is not empty!", []));
    } else {
        idBookings = Number(idBookings);
        if (isNaN(idBookings)) {
            return res.status(404).json(FormatResponseJson(404, "Id is not Number", []));
        }
    }

    try {
        let result = await BookingsService.Confirm(idBookings, confirmBooking.idTable, confirmBooking.status);
        if (!result || result.length === 0) {
            return res.status(401).json(FormatResponseJson(401, "Update bookings failed!", []));
        }
        req.io.emit('bookingSuccess');
        return res.status(200).json(FormatResponseJson(200, "Updated bookings successful!", [result]));

    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error!", []));
    }
}

const DeleteBookings = async (req, res) => {
    let id = req.params.id;
    if (!id) {
        return res.status(404).json(FormatResponseJson(404, "Id is not empty!", []));
    }

    try {
        let bookings = await BookingsService.FindOneById(id);
        if (bookings.length === 0) {
            return res.status(404).json(FormatResponseJson(404, "Bookings is not found!", []));
        }

        let idBookingsDelete = await BookingsService.Delete(id);
        if (idBookingsDelete !== 0) {
            return res.status(200).json(FormatResponseJson(200, "Deleted bookings successful!", [{ "iddatban": idBookingsDelete }]));
        }
        return res.status(401).json(FormatResponseJson(401, "Delete bookings failed!", []));

    } catch (e) {
        console.log(e);
        return res.status(500).json(FormatResponseJson(500, "Internal Server Error", []));
    }
}

export {
    GetBookings,
    GetBookingsList,
    NewBookings,
    UpdateBookings,
    DeleteBookings,
    ConfirmBooking,
    GetBookingsWithIdCustomer,
    GetBookingsWithTable,
}