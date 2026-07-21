// =============================
// Coffee Shop Script
// =============================

let cart = [];

// =============================
// เพิ่มสินค้า
// =============================
function addCart(name, price, sweetID = null, typeID = null){

    let sweet = "-";
    let type = "-";

    if(sweetID){
        let sweetSelect = document.getElementById(sweetID);
        if(sweetSelect){
            sweet = sweetSelect.value;
        }
    }

    if(typeID){
        let typeSelect = document.getElementById(typeID);
        if(typeSelect){
            type = typeSelect.value;
        }
    }

    let found = cart.find(item =>
        item.name === name &&
        item.sweet === sweet &&
        item.type === type
    );

    if(found){
        found.quantity++;
    }else{
        cart.push({
            name,
            price,
            sweet,
            type,
            quantity:1
        });
    }

    showCart();
}

// =============================
// แสดงตะกร้า
// =============================
function showCart(){

    let list=document.getElementById("cartList");

    list.innerHTML="";

    let total=0;
    let count=0;

    cart.forEach(function(item,index){

        let sum=item.price*item.quantity;

        total+=sum;

        count+=item.quantity;

        let li=document.createElement("li");

        li.innerHTML = `
<div class="cart-header">
    <h3>${item.name}</h3>

    <div class="qty-btn">
        <button onclick="plus(${index})">+</button>
        <button onclick="minus(${index})">−</button>
    </div>
</div>

🍬 ความหวาน ${item.sweet}%<br>
🍽 จำนวน ${item.quantity}<br>
💸 ${sum} บาท

<hr>
`;

        list.appendChild(li);

    });

    document.getElementById("total").innerHTML=total;

    document.getElementById("cartCount").innerHTML=count;

}

// =============================
// เพิ่มจำนวน
// =============================
function plus(index){

    cart[index].quantity++;

    showCart();

}

// =============================
// ลดจำนวน
// =============================
function minus(index){

    cart[index].quantity--;

    if(cart[index].quantity<=0){

        cart.splice(index,1);

    }

    showCart();

}

// =============================
// ลบสินค้า
// =============================
function removeCart(index){

    cart.splice(index,1);

    showCart();

}

// =============================
// เปิด / ปิด ตะกร้า
// =============================
function showCartBox(){

    let box=document.getElementById("cartBox");

    if(box.style.display=="block"){

        box.style.display="none";

    }else{

        box.style.display="block";

    }

}

// =============================
// ชำระเงิน
// =============================
function checkout(){

    if(cart.length == 0){
        alert("กรุณาเลือกสินค้าก่อน");
        return;
    }

    let total = 0;
    let order = "";

    cart.forEach(item=>{

        total += item.price * item.quantity;

        order +=
        item.name +
        " x" +
        item.quantity +
        " = " +
        (item.price * item.quantity) +
        " บาท\n";

    });

    function generateOrderNo(){

    let lastNumber = localStorage.getItem("lastOrderNumber");

    if(!lastNumber){
        lastNumber = 0;
    }

    lastNumber = Number(lastNumber) + 1;

    localStorage.setItem("lastOrderNumber", lastNumber);

    return "CF-" + lastNumber;

}

let orderNo = generateOrderNo();

let ok = confirm(
    "☕ Coffee Time ☕\n\n" +
    "📦 รายการสินค้า 📦\n\n" +
    order +
    "\n💸 ยอดรวม " + total + " บาท\n\n" +
    "📝 หมายเลขออเดอร์: " + orderNo +
    "\n\n🛎️ กรุณานำเลขออเดอร์นี้ไปชำระเงินที่เคาน์เตอร์\n\n" +
    "ยืนยันการสั่งซื้อ?"
);

    if(ok){

        fetch("https://coffee-time-tmt5.onrender.com/order", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        orderNo,
        items: cart,
        total
    })
})
.then(res => {
    if (!res.ok) {
        throw new Error("ส่งออเดอร์ไม่สำเร็จ");
    }
    return res.json();
})
.then(data => {

    localStorage.setItem("lastOrder", orderNo);

    cart = [];
    showCart();

    alert("✅ รับออเดอร์เรียบร้อย");

})
.catch(err => {
    console.error(err);
    alert("❌ ส่งออเดอร์ไม่สำเร็จ");
});
    }

}
// =============================
// ค้นหาเมนู
// =============================
function searchMenu(){

    let input=document.getElementById("search").value.toUpperCase();

    let cards=document.getElementsByClassName("card");

    for(let i=0;i<cards.length;i++){

        let title=cards[i].getElementsByTagName("h3")[0];

        if(title.innerHTML.toUpperCase().indexOf(input)>-1){

            cards[i].style.display="inline-block";

        }else{

            cards[i].style.display="none";

        }

    }

}

// =============================
// ล้างตะกร้าทั้งหมด
// =============================
function clearCart(){

    if(cart.length === 0){
        alert("ตะกร้าว่าง");
        return;
    }

    let ok = confirm("ต้องการลบสินค้าทั้งหมดออกจากตะกร้าหรือไม่?");

    if(ok){
        cart = [];
        showCart();
    }

}
async function changeStatus(orderNo, status){

    await fetch("https://coffee-time-tmt5.onrender.com/order/" + orderNo, {

        method:"PUT",

        headers:{
            "Content-Type":"application/json"
        },

        body: JSON.stringify({
            status: status
        })

    });

    // ถ้ามีฟังก์ชัน loadOrders() ค่อยเรียก
    if(typeof loadOrders === "function"){
        loadOrders();
    }

}
async function checkStatus(){

    let orderNo = localStorage.getItem("lastOrder");

    if(!orderNo){
        return;
    }

    let res = await fetch("https://coffee-time-tmt5.onrender.com/order/" + orderNo);

    if(!res.ok){
        return;
    }

    let order = await res.json();

let statusBox = document.getElementById("orderStatus");

if(statusBox){
    statusBox.innerHTML = `
        <h3>เลขออเดอร์ : ${order.orderNo}</h3>
        <h2>สถานะ : ${order.status}</h2>
    `;
}
}

checkStatus();
setInterval(checkStatus,1000);