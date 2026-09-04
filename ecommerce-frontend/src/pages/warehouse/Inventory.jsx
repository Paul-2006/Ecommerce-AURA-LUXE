import {useState} from "react";


function Inventory(){


const [products,setProducts]=useState([

{
id:1,
name:"Demo Product",
stock:50
},

{
id:2,
name:"Mobile",
stock:20
}

]);



return(

<div className="container">


<h1>
Warehouse Inventory
</h1>



<table 
border="1"
width="100%"
cellPadding="10"
>


<thead>

<tr>

<th>
Product ID
</th>


<th>
Product Name
</th>


<th>
Available Stock
</th>


</tr>

</thead>



<tbody>


{

products.map(product=>(


<tr key={product.id}>


<td>
{product.id}
</td>


<td>
{product.name}
</td>


<td>
{product.stock}
</td>


</tr>


))


}


</tbody>


</table>


</div>


);


}


export default Inventory;