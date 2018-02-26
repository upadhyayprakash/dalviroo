import React, { Component } from "react";
import $ from 'jquery';
 
class Reports extends Component {
	constructor(props)
	{
		super(props);
		this.state = {tblHTMLContent: [], tblDataArr : []};
	}
	
	componentWillUnmount()
	{
		console.log('####### STOPPING Reports data request interval...');
		clearInterval(intervalReports); // Avoid Unnecessary API call, when user moves to other tabs in UI.
	}
	
	componentDidMount()
	{
		// Setting Initial Content for 'Report' table
		let rowArr = [];
		rowArr.push(<tr key={0}><td colSpan="4" align="center">Loading...</td></tr>);
		this.setState({tblHTMLContent: rowArr});
		
		
		const selfComp = this; // Component Reference
		
		// Fetching Report details from REST API.
		window.intervalReports = setInterval(function(){
			console.log('Requesting Reporting data...');
			$.ajax({
			url: "http://localhost:3000/api/orders/getReport",
			dataType: 'json',
			success: function(result){
				console.log(result);
				var prodArr = result.prodArr;
				console.log('Number of Products retrieved: '+prodArr.length);
				let tblHTMLRes=[];
				for(let i=0;i<prodArr.length;i++)
				{
					// Forming table Records
					tblHTMLRes.push(
									<tr key={i}>
										<td>{prodArr[i].prod_name}</td>
										<td>{prodArr[i].prediction_value}</td>
										<td>{prodArr[i].ordered_tillnow_qnty}</td>
										<td>{prodArr[i].created_tillnow_qnty}</td>
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
						<h2>REPORTS</h2>
						<br/>
						<table className="table table-bordered table-striped order-table">
							<thead>
								<tr>
									<th>ITEM NAME</th>
									<th>PREDICTED QTY</th>
									<th>ORDERED QTY</th>
									<th>COMPLETED QTY</th>
								</tr>
							</thead>
							<tbody>
							
							{ this.state && this.state.tblHTMLContent }
							
							{/*} <tr>
									<td>Kadhaai Paneer</td>
									<td>130</td>
									<td>35</td>
									<td>20</td>
								</tr>
								<tr>
									<td>Aloo Paratha</td>
									<td>350</td>
									<td>80</td>
									<td>65</td>
								</tr>
								<tr>
									<td>Lassi</td>
									<td>90</td>
									<td>35</td>
									<td>25</td>
								</tr>
								<tr>
									<td>Dal Makhani</td>
									<td>85</td>
									<td>30</td>
									<td>20</td>
								</tr> {*/}
							</tbody>
						</table>
					  </div>
					);
	}
}
 
export default Reports;