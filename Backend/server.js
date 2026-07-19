console.log(__filename);
console.log("===== SERVER VERSION 2026 =====");

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let orders = [];

// =============================
// ทดสอบ Server
// =============================
app.get("/", (req, res) => {
    res.send("Server ทำงานแล้ว");
});

// =============================
// รับออเดอร์
// =============================
app.post("/order", (req, res) => {

    const order = req.body;

    order.status = "รอรับออเดอร์";

    orders.push(order);

    console.log("📦 รับออเดอร์ใหม่");
    console.log(order);

    res.json({
        success: true
    });

});

// =============================
// ดูออเดอร์ทั้งหมด
// =============================
app.get("/orders", (req, res) => {

    res.json(orders);

});

// =============================
// ดูออเดอร์ตามเลข
// =============================
app.get("/order/:orderNo", (req, res) => {

    const order = orders.find(
        o => o.orderNo === req.params.orderNo
    );

    if (!order) {
        return res.status(404).json({
            success: false,
            message: "ไม่พบออเดอร์"
        });
    }

    res.json(order);

});

// =============================
// เปลี่ยนสถานะออเดอร์
// =============================
app.put("/order/:orderNo", (req, res) => {

    const order = orders.find(
        o => o.orderNo === req.params.orderNo
    );

    if (!order) {
        return res.status(404).json({
            success: false,
            message: "ไม่พบออเดอร์"
        });
    }

    order.status = req.body.status;

    res.json({
        success: true
    });

});

// =============================
// Start Server (รองรับ Render)
// =============================
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log("🚀 Server running on port " + PORT);
});