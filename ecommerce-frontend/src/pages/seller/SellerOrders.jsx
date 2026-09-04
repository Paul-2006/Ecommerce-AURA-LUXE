function SellerOrders() {

    return (

        <div className="container">

            <h1>Seller Orders</h1>

            <br />

            <table border="1" width="100%" cellPadding="10">

                <thead>

                    <tr>

                        <th>Order ID</th>

                        <th>Customer</th>

                        <th>Product</th>

                        <th>Quantity</th>

                        <th>Status</th>

                    </tr>

                </thead>

                <tbody>

                    <tr>

                        <td>1</td>

                        <td>Customer 1</td>

                        <td>Demo Product</td>

                        <td>2</td>

                        <td>Processing</td>

                    </tr>

                </tbody>

            </table>

        </div>

    );

}

export default SellerOrders;