var express = require('express');
var router = express.Router();
var queryString = require('querystring');
var dbCon = require('../db');
var async = require('async');

/* GET getReport */
router.get('/getReport', function(req, res, next) {
	let resJSON = {status: null, msg: null, requestTimestamp: null, prodArr:[]};
  
	let sql = 'CALL get_report()';
	
	dbCon.query(sql, function(err, rows)
	{
		resJSON.requestTimestamp = Date.now();
		if(err) //throw err;
		{
			resJSON.status = 'FAILED';
			resJSON.msg = 'Internal Error while retrieving the details';//err.code;
			res.send(resJSON);
		}
		else
		{
			resJSON.status = 'SUCCESS';
			resJSON.msg = 'Data Successfully Loaded';
			console.log('Result: '+rows);
			for(let i=0;i<rows[0].length;i++)
			{
				let prodStr = {
								prod_id: null,
								prod_name: null,
								prediction_value: null,
								created_tillnow_qnty: null,
								ordered_tillnow_qnty: null
							};
				prodStr.prod_id = rows[0][i].prod_id;
				prodStr.prod_name = rows[0][i].prod_name;
				prodStr.prediction_value = rows[0][i].prediction_value;
				prodStr.created_tillnow_qnty = rows[0][i].created_tillnow_qnty;
				prodStr.ordered_tillnow_qnty = rows[0][i].ordered_tillnow_qnty;
				
				resJSON['prodArr'].push(prodStr);
				prodStr = null;
			}
			res.send(resJSON);
		}
	});
});

/* POST setPrediction */
router.post('/setPrediction', function(req, res) {
	let resJSON = {status: null, msg: null, requestTimestamp: null};
	console.log(req.body);
	
	let prodArr = req.body.prodArr;
	console.log(prodArr);
	
	let sql = "";
	
	async.forEachOf(prodArr, function(prodJSonElement, index, inner_callback){
		sql = 'UPDATE dalviroo.tblProductStatus SET prediction_value = '+ prodJSonElement.prediction_value + ', prediction_timestamp = CURRENT_TIMESTAMP() WHERE prod_id = '+ prodJSonElement.prod_id;
		resJSON.requestTimestamp = Date.now();
		dbCon.query(sql, function(err, rows){
			if(err)
			{
				console.log(err);
				let errStr = 'Error while updating the Details for prod_id: '+prodJSonElement.prod_id;
				inner_callback(errStr);
			}
			else
			{
				console.log('Data Update Success for prod_id: '+prodJSonElement.prod_id);
				console.log('Result: '+rows);
				inner_callback(null);
			}	
		});		
	}, function(err){
		if(err)
		{
			console.log(err);
			resJSON.status = 'FAILED';
			resJSON.msg = 'Error occurred while updating one or more products...';
			res.send(resJSON);
		}
		else
		{
			resJSON.status = 'SUCCESS';
			resJSON.msg = 'Data Successfully Uploaded for: '+ prodArr.length +' products...';
			res.send(resJSON);
		}
	});
});

/* POST setProductDone */
router.post('/setProductDone', function(req, res) {
	let resJSON = {status: null, msg: null, requestTimestamp: null};
	console.log(req.body);
	
	let prod_id = req.body.prod_id;
	let order_id = req.body.order_id;
	
	console.log('Order ID: '+order_id+', Product ID:'+prod_id);
	
	let sql = "";
	
	sql = 'CALL setProductDone(?, ?, @output); SELECT @output';
	resJSON.requestTimestamp = Date.now();
	dbCon.query(sql, [order_id, prod_id], function(err, rows){
		if(err)
		{
			console.log(err);
			resJSON.status = 'FAILED';
			resJSON.msg = 'Error occurred while updating Product DONE status...';
			res.send(resJSON);
		}
		else
		{
			console.log('Result: '+rows);
			resJSON.status = 'SUCCESS';
			resJSON.msg = 'Status Update SUCCESS for Product ID: '+ prod_id +', Order ID: '+ order_id;
			res.send(resJSON);
		}	
	});
});

/* POST placeOrder */
router.post('/placeOrder', function(req, res) {
	let resJSON = {status: null, orderId: null, msg: null, requestTimestamp: null};
	console.log(req.body);
	
	let custId = req.body.cust_id;
	let prodArr = req.body.prodArr;
	console.log('Product Array: '+prodArr);
	
	let prodIdArr = [];
	let prodQntyArr = [];
	
	prodArr.forEach(function(prodObj){
		prodIdArr.push(prodObj.prod_id);
		prodQntyArr.push(prodObj.prod_qnty);
	});
	
	console.log('Product ID Array: '+ prodIdArr);
	console.log('Product Quantity Array: '+ prodQntyArr);
	
	let sql = "";
	
	sql = 'CALL placeOrder(?, ?, ?, @orderId); SELECT @orderId';
	resJSON.requestTimestamp = Date.now();
	dbCon.query(sql, [prodIdArr.toString(), prodQntyArr.toString(), custId], function(err, rows){
		if(err)
		{
			console.log(err);
			resJSON.status = 'FAILED';
			resJSON.msg = 'Error occurred while Placing the Order';
			res.send(resJSON);
		}
		else
		{
			console.log('Result: '+rows);
			resJSON.status = 'SUCCESS';
			resJSON.orderId = rows[1][0]['@orderId'];
			resJSON.msg = 'Order placed Successfully';
			res.send(resJSON);
		}	
	});
});

/* GET getOrderDetails */
router.get('/getOrderDetails', function(req, res, next) {
	let resJSON = {status: null, msg: null, requestTimestamp: null, orderArr:[]};
  
	let sql = 'CALL getOrderDetails()';
	
	dbCon.query(sql, function(err, rows)
	{
		resJSON.requestTimestamp = Date.now();
		if(err) //throw err;
		{
			resJSON.status = 'FAILED';
			resJSON.msg = 'Internal Error while retrieving the details';//err.code;
			res.send(resJSON);
		}
		else
		{
			resJSON.status = 'SUCCESS';
			resJSON.msg = 'Data Successfully Loaded';
			console.log('Result: '+rows);
			for(let i=0;i<rows[0].length;i++)
			{
				let orderStr = {
								order_id		: null,
								order_timestamp	: null,
								cust_id			: null,
								cust_name		: null,
								prod_id			: null,
								prod_name		: null,
								prod_qnty		: null,
								order_status	: null
							};
				orderStr.order_id = rows[0][i].order_id;
				orderStr.order_timestamp = rows[0][i].order_timestamp;
				orderStr.cust_id = rows[0][i].cust_id;
				orderStr.cust_name = rows[0][i].cust_name;
				orderStr.prod_id = rows[0][i].prod_id;
				orderStr.prod_name = rows[0][i].prod_name;		
				orderStr.prod_qnty = rows[0][i].prod_qnty;
				orderStr.order_status = rows[0][i].order_status;
				
				
				resJSON['orderArr'].push(orderStr);
				orderStr = null;
			}
			res.send(resJSON);
		}
	});
});

module.exports = router;