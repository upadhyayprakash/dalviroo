import React, { Component } from "react";
import $ from 'jquery';

class Orders extends Component 
{
  
	constructor(props)
	{
		super(props);
		this.state = {tblHTMLContent: [], tblDataArr : []};
		this.onMarkDone = this.onMarkDone.bind(this);
		this.daysArr = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
	}
	
	// When Item is marked as 'DONE'
	onMarkDone(orderId, prodId)
	{
		console.log('Marking as DONE for Order: ' + orderId + ' | Product: '+prodId);
		console.log('Current Object is:');
		window.variable = this;
		console.log(this);
		let dataJSon = {"order_id": orderId, "prod_id": prodId};
		$.ajax({
			url: "http://localhost:3000/api/orders/setProductDone",
			method: 'POST',
			data: JSON.stringify(dataJSon),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(result){
				console.log(result);				
			},
			error: function(err){
				alert('ERROR: '+err);
			}
		});
	}
	
	componentWillUnmount()
	{
		console.log('####### STOPPING Orders data request interval...');
		clearInterval(intervalOrders); // Avoid Unnecessary API call, when user moves to other tabs in UI.
	}
	
	componentDidMount()
	{
		// Setting Initial Content for 'Report' table
		let rowArr = [];
		rowArr.push(<tr key={0}><td colSpan="6" align="center">Loading...</td></tr>);
		this.setState({tblHTMLContent: rowArr});
		
		
		const selfComp = this; // Component Reference
		
		// Fetching Report details from REST API.
		window.intervalOrders = setInterval(function(){
			console.log('Requesting Orders data...');
			$.ajax({
			url: "http://localhost:3000/api/orders/getOrderDetails",
			dataType: 'json',
			success: function(result){
				console.log(result);
				var orderArr = result.orderArr;
				console.log('Number of Products retrieved: '+orderArr.length);
				let tblHTMLRes=[];
				for(let i=0;i<orderArr.length;i++)
				{
					let btnActionClass = 'btn-default';
					let isDisabled = true;
					let btnText = "COMPLETED";
					if(orderArr[i].order_status === 'NEW')
					{
						btnActionClass = 'btn-success';
						isDisabled = false;
						btnText = "MARK DONE";
					}
					
					// Forming table Records
					tblHTMLRes.push(
									<tr key={i}>
										<td>{orderArr[i].order_id}</td>
										<td>{orderArr[i].cust_name}</td>
										<td>{orderArr[i].prod_name}</td>
										<td>{orderArr[i].prod_qnty}</td>
										<td title={selfComp.daysArr[new Date(orderArr[i].order_timestamp).getDay()]}>{new Date(orderArr[i].order_timestamp).toLocaleString()}</td>
										<td><button onClick={selfComp.onMarkDone.bind(this, orderArr[i].order_id, orderArr[i].prod_id)} disabled={isDisabled} className={"btn "+ btnActionClass}>{btnText}</button></td>
									</tr>);
				}
				selfComp.setState({tblHTMLContent : tblHTMLRes});
				console.log(selfComp.state.tblHTMLContent);
			},
			error: function(err){
				alert('ERROR: '+err);
			}
		});}, 4000);
	}
	
  
	render() {
		return (
				  <div>
					<h2>ORDERS</h2>
					<br/>
					<table className="table table-bordered order-table">
						<thead>
							<tr>
								<th>ORDER ID</th>
								<th>CUSTOMER</th>
								<th>ITEM</th>
								<th>QUANTITY</th>
								{/*}<th>STATUS</th> {*/}
								<th>PLACED AT</th>
								<th>ACTION</th>
							</tr>
						</thead>
						<tbody>
						
						{ this.state && this.state.tblHTMLContent }
						
						{/*}
							<tr className="alt1">
								<td>1</td>
								<td>Prakash Upadhyay</td>
								<td>Kadhaai Paneer</td>
								<td>1</td>
								<td>NEW</td>
								<td><button className="btn btn-success">MARK DONE</button></td>
							</tr>
							<tr className="alt2">
								<td>2</td>
								<td>Nisha Dubey</td>
								<td>Aloo Paratha</td>
								<td>2</td>
								<td>NEW</td>
								<td><button className="btn btn-success">MARK DONE</button></td>
							</tr>
							<tr className="alt2">
								<td>2</td>
								<td>Nisha Dubey</td>
								<td>Lassi</td>
								<td>1</td>
								<td>NEW</td>
								<td><button className="btn btn-success">MARK DONE</button></td>
							</tr>
							<tr className="alt1">
								<td>3</td>
								<td>Vijay Mishra</td>
								<td>Dal Makhani</td>
								<td>1</td>
								<td>DONE</td>
								<td><button className="btn btn-default" disabled>COMPLETED</button></td>
							</tr>
							{*/}
						</tbody>
					</table>
				  </div>
		);
	}
}
 
export default Orders;