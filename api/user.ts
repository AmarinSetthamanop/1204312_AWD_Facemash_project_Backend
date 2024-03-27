import express from "express";
import mysql from "mysql";
import { UserPostRequest } from "../model/userModel";
import { connection } from "../connection";
import util from "util";



// export ให้ router สามารถไปใช้งานในไฟล์อื่นได้
// สร้าง object ของ Router ที่อยู่ใน expresss
// express.Router คือ สร้างเส้นทางต่างๆ หรือ api ต่างๆ สำหรับ get, post, put, delete
export const router = express.Router();


// //============================================================= tset http://127.0.0.1:3000/user
// router.get("/", (request, response) => {
//     response.send({
//         data : "hi i am is get in user.ts"
//     });
// });



// //============================================================= login ไม่ว่าจะเป็น user หรือ admin http://127.0.0.1:3000/user/login
// router.post("/login", (request, response) => {
//     // ดึงค่ามาจาก body
//     let body = request.body; 
//     // สร้างคำสั่ง sql
//     let sql = "select * from User_Facemash where email = ? and password = ?";
//     // กำหนดค่าให้กับ ? ที่อยู่ในคำสั่ง sql
//     sql = mysql.format(sql, [
//         body['email'],
//         body['password'],
//     ]);
//     // ส่งคำสั่ง query ไปหา Database
//     connection.query(sql, (err, result) => {
//         if (err) throw err;
//         console.log(result)
//         response.status(200).json(result[0]);
//     });
// });



// //============================================================== ค้นหาผู้ใช้ด้วย ID
// router.get("/login/:uid", (request, response) => {
//     // ตึง paramitor ออกมาจาก url
//     let uid = +request.params.uid;
//     // สร้างคำสั่ง sql
//     let sql = "select * from User_Facemash where UID = ?";
//     // กำหนดค่าให้กับ ? ที่อยู่ในคำสั่ง sql
//     sql = mysql.format(sql, [
//         uid,
//     ]);
//     // ส่งคำสั่ง query ไปหา Database
//     connection.query(sql, (err, result) => {
//         if (err) throw err;
//         console.log(result)
//         response.status(200).json(result[0]);
//     });
// });






////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


router.get("/", (req, res) => {
    res.send("Get in User.ts");
});

// Endpoint สำหรับสมัครสมาชิกของ User
router.post("/signup", async (req, res) => {
    let user: UserPostRequest = req.body;

    // ทำการเช็คก่อนว่า email ที่จะสมัครสมาชิกมีอยู่เเล้วหรือไม่ ถ้ามีอยู่เเล้วจะต้องใช้ email ตัวใหม่ที่ไม่ซํ้ากันเท่านั้น
    let sql = "SELECT * FROM User_Facemash WHERE email = ?";
    sql = mysql.format(sql, [
        user.email,
    ]);
    connection.query(sql, async (err, result) => {
        if (err) {
            res.status(400).json(err);
        } else {
            if (result.length == 1) {
                res.status(205).json(err);
            } else {
                let sql = "INSERT INTO `User_Facemash`(`name`, `email`, `password`, `image`, `type`) VALUES (?,?,?,NULL,'user')";
                sql = mysql.format(sql, [
                    user.name, 
                    user.email,
                    user.password,
                ]);
                connection.query(sql, (err, result) => {
                    if (err) {
                        res.status(400).json(err);
                    } else {
                        res.status(201).json({ affected_row: result.affectedRows, last_idx: result.insertId });
                    }
                });
            }
        }
    });
});

// Endpoint สำหรับ login เข้าสู่ระบบของ User
router.post("/login", (req, res) => {
    let body = req.body; 
    let sql = "SELECT * FROM User_Facemash WHERE email = ?";
    sql = mysql.format(sql, [
        body['email'],
    ]);
    connection.query(sql, async (err, result) => {
        if (err) {
            res.status(400).json(err);
        } else {
            if (result.length == 1) {
                if (body['password'] === result[0].password) { // ถ้าตรงกันก็ทำการส่งข้อมูลของ user คนนั้นออกไป
                    sql = "SELECT * FROM User_Facemash WHERE email = ?";
                    sql = mysql.format(sql, [
                        body['email'],
                    ]);
                    connection.query(sql, (err, result) => {
                        if (err) {
                            res.status(400).json(err);
                        } else {
                            res.status(200).json(result);
                        }
                    });
                } else {
                    res.status(400).json({"result": "รหัสผ่านไม่ถูกต้อง"});
                }
            } else {
                res.status(400).json({"result": "ไม่มี Email นี้ อยู่ใน ฐานข้อมูล คุณต้อง สมัครสมาชิกเสียก่อน"});
            }
        }
    });
});

// Endpoint สำหรับค้นหาข้อมูลของ User ด้วย UID
router.get("/:uid", (req, res) => {
    let uid = +req.params.uid;
    let sql = "select * from User_Facemash where UID = ?";

    sql = mysql.format(sql, [
        uid,
    ]);
    connection.query(sql, (err, result) => {
        if (err) {
            res.status(400).json(err);
        } else {
            res.status(200).json(result);
        }
    });
});

// Endpoint สำหรับ admin เพื่อดูรายการผู้ใช้เเละโปรไฟล์ของผู้ใช้ทุกคนในระบบ
router.get("/admin/:type", (req, res) => {
    let type = req.params.type;
    if (type == "admin") {
        let sql = "select * from User_Facemash where type not in (?)";
        sql = mysql.format(sql, [
            type,
        ]);
        connection.query(sql, (err, result) => {
            if (err) {
                res.status(400).json(err);
            } else {
                res.status(200).json(result);
            }
        });
    } else {
        res.status(400).json({"result": "สามารถดูได้เฉพาะ admin เท่านั้น"});
    }
});



//============================================================================================================================================================== Endpoint สำหรับนับจำนวนรูปภาพของ User คนนั้นๆ
//==============================================================================================================================================================
//==============================================================================================================================================================
//==============================================================================================================================================================
//==============================================================================================================================================================
router.get("/count/photo/:uid", (req, res) => {
    let uid = req.params.uid; // ทำการรับ uid ของผู้ใช้เข้ามาเเบบ Path params
    let sql = `SELECT (COUNT(Photo_Facemash.photo_url)) AS count_image FROM User_Facemash INNER JOIN Photo_Facemash 
    ON User_Facemash.UID = Photo_Facemash.UID WHERE User_Facemash.UID = ?`;
    sql = mysql.format(sql, [
        uid,
    ]);
    connection.query(sql, (err, result) => { // ทำการ query ไปที่ database เพื่อนับจำนวนรูปภาพของ User คนนั้นๆ
        if (err) {
            res.status(400).json(err); 
        } else {
            res.status(200).json(result);
        }
    });
});

// Endpoint สำหรับเเก้ไขข้อมูลส่วนตัวของตนเองได้ ได้เเก่ ชื่อเรียกในระบบ รูปเเทนตัว(Avatar) รหัสผ่าน(การยืนยันรหัสผ่าน)
router.put("/:uid", async (req, res) => {
    let uid = +req.params.uid; // ดึงค่าจากพารามิเตอร์ที่ส่งเข้ามาออกมาใช้
    let user: UserPostRequest = req.body['user_data']; // นำข้อมูล json ที่ตรงกับ model ไปเก็บไว้ใน model ของ User
    let change_password = req.body['change_password']; // นำข้อมูล password_original เเละ confirm_password มาใช้งานในกรณีที่ผู้ใช้ต้องการเปลี่ยนรหัสผ่าน เพื่อยืนยันรหัสผ่าน

    let userOriginal: UserPostRequest | undefined; //userOriginal เพื่อเก็บข้อมูลเดิมของ User คนนั้นๆ
    const queryAsync = util.promisify(connection.query).bind(connection);

    // ทำการค้นหาข้อมูลเดิมของ User เพื่อเก็บข้อมูลเดิมไว้ใช้ในการ Update กรณีที่ User ต้องการ Update เฉพาะข้อมูลบางคอลัมน์ของตัวเอง
    let sql = mysql.format("select * from User_Facemash where UID = ?", [uid]);
    let result = await queryAsync(sql);
    const rawData = JSON.parse(JSON.stringify(result));
    // console.log(rawData);

    userOriginal = rawData[0] as UserPostRequest;
    let passwordOriginal = userOriginal.password;
    // console.log(userOriginal);

    let updateUser = {...userOriginal, ...user}; // นำข้อมูลที่ต้องการจะ Update ไปรวมกับข้อมูลเดิม
    // console.log(user);
    // console.log(updateUser);

    if (user.password) { // ในกรณีที่ผู้ใช้ต้องการเปลี่ยนรหัสผ่าน user.password ต้องมีค่ามาก่อน

        // เปรียบเทียบ password เดิมที่ส่งเข้ามา เเละ password เดิมที่อยู่ในฐานข้อมูล ว่าตรงกันไหม
        if (change_password['password_original'] === passwordOriginal) { // ถ้า User ใส่รหัสผ่านเดิมถูกต้องจะเข้าที่เงื่อนไขนี้

            if (user.password == change_password['confirm_password']) { // ทำการ confirm password ที่ต้องการ Update

                sql = "update `User_Facemash` set `name`=?, `email`=?, `password`=?, `image`=? where `UID`=?";
                sql = mysql.format(sql, [ // นำข้อมูลที่ต้องการจะ Update ที่รวมกับข้อมูลเดิมเเล้วไป Update ตาราง User_Facemash
                    updateUser.name,
                    updateUser.email,
                    user.password,
                    updateUser.image,
                    uid,
                ]);
                connection.query(sql, (err, result) => {
                    if (err) throw err;
                    res.status(201).json({ affected_row: result.affectedRows });
                });
            } else {
                // ในกรณีที่ User ยืนยันรหัสผ่านที่ต้องการเปลี่ยนไม่ถูกต้อง
                res.status(400).json({"result": "ยืนยันรหัสผ่านใหม่ไม่ต้องถูก"});
            }
        } else {
            // ในกรณีที่รหัสผ่านเดิมไม่ถูกต้อง
            res.status(400).json({"result": "รหัสผ่านเดิมไม่ถูกต้อง"});
        }
    } else {
        // ในกรณีที่ User ไม่ต้องการเปลี่ยนรหัสผ่าน
        sql = "update `User_Facemash` set `name`=?, `email`=?, `password`=?, `image`=? where `UID`=?";
        sql = mysql.format(sql, [ // นำข้อมูลที่ต้องการจะ Update ที่รวมกับข้อมูลเดิมเเล้วไป Update ตาราง User_Facemash
            updateUser.name,
            updateUser.email,
            updateUser.password,
            updateUser.image,
            uid,
        ]);
        connection.query(sql, (err, result) => {
            if (err) throw err;
            res.status(201).json({ affected_row: result.affectedRows });
        });
    }
});