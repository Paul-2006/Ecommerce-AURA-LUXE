import "../../css/Dashboard.css";


function WarehouseDashboard(){


return(

<div className="dashboard-container">


<h1>
Warehouse Dashboard 📦
</h1>


<p>
Manage inventory and shipment operations
</p>




<div className="dashboard-grid">



<div className="dashboard-card">

<h2>
📦 Inventory
</h2>

<p>
View available product stock
</p>

<button>
View Stock
</button>

</div>





<div className="dashboard-card">

<h2>
⚠️ Low Stock Alerts
</h2>

<p>
Check products requiring restock
</p>

<button>
Check Alerts
</button>

</div>





<div className="dashboard-card">

<h2>
🚚 Shipments
</h2>

<p>
Track warehouse shipments
</p>

<button>
View Shipments
</button>

</div>





<div className="dashboard-card">

<h2>
🔔 Notifications
</h2>

<p>
Warehouse updates and messages
</p>

<button>
View Notifications
</button>

</div>



</div>


</div>

);


}


export default WarehouseDashboard;