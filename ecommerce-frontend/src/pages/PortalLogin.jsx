import { useNavigate } from "react-router-dom";
import "../css/PortalLogin.css";


function PortalLogin(){


const navigate = useNavigate();



const portals = [

{
name:"Customer",
path:"/customer/login",
icon:"👤"
},


{
name:"Seller",
path:"/seller/login",
icon:"🏪"
},


{
name:"Admin",
path:"/admin/login",
icon:"🛡️"
},


{
name:"Warehouse",
path:"/warehouse/login",
icon:"📦"
},


{
name:"Delivery Partner",
path:"/delivery/login",
icon:"🚚"
}


];



return(


<div className="portal-container">


<h1>
Choose Your Portal
</h1>



<p>
Login according to your role
</p>



<div className="portal-grid">



{

portals.map(portal=>(


<div

className="portal-card"

key={portal.name}

onClick={()=>
navigate(portal.path)
}

>


<div className="portal-icon">

{portal.icon}

</div>



<h2>

{portal.name}

</h2>



<button>

Login

</button>



</div>


))


}



</div>



</div>


);


}


export default PortalLogin;