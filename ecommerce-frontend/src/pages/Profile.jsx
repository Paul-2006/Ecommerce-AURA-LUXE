import {useEffect,useState} from "react";

import api from "../api/axios";


function Orders(){


const [orders,setOrders]=useState([]);



useEffect(()=>{

getOrders();

},[]);



const getOrders=async()=>{


const res =
await api.get("/Order/Customer/1");


setOrders(res.data);


};



return(

<div>


<h2>
My Orders
</h2>


{

orders.map(order=>(


<div key={order.orderId}>


<h3>
Order ID : {order.orderId}
</h3>


<p>
Status : {order.orderStatus}
</p>


<p>
Amount : {order.totalAmount}
</p>


</div>


))


}



</div>

);


}


export default Orders;