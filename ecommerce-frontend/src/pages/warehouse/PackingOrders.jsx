function PackingOrders(){


return(

<div className="container">


<h1>
Orders For Packing
</h1>



<table
border="1"
width="100%"
cellPadding="10"
>


<thead>

<tr>

<th>
Order ID
</th>


<th>
Customer
</th>


<th>
Status
</th>


<th>
Action
</th>


</tr>


</thead>



<tbody>


<tr>


<td>
101
</td>


<td>
Customer 1
</td>


<td>
Pending Packing
</td>


<td>

<button>
Pack Order
</button>

</td>


</tr>


</tbody>



</table>


</div>


);


}


export default PackingOrders;