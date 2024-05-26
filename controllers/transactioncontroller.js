
const Transaction = require('../models/transaction');
const axios = require('axios');
const PORT = process.env.PORT || 5001;

async function init(req, res)  {
    const url = 'https://s3.amazonaws.com/roxiler.com/product_transaction.json';
    try {
      const response = await axios.get(url);
      await Transaction.insertMany(response.data);
      res.status(200).send('Database initialized');
    } catch (error) {
      res.status(500).send('Error initializing database');
    }
  }
 async function transaction (req, res)  {
    const { month, search = '', page = 1, perPage = 10 } = req.query;

    
    if (!month || isNaN(month) || month < 1 || month > 12) {
        return res.status(400).json({ error: 'Invalid month parameter' });
    }

    const regex = new RegExp(search, 'i');
    const startDate = new Date(`2021-${month}-01`);
    const endDate = new Date(`2022-${month}-31`);
  
    try {
      const transactions = await Transaction.find({
        dateOfSale: { $gte: startDate, $lt: endDate },
        $or: [{ title: regex }, { description: regex }]
      })
        .skip((page - 1) * perPage)
        .limit(parseInt(perPage));
      res.json(transactions);
    } catch (error) {
      res.status(500).send('Error fetching transactions');
      console.log("yelo",error)
    }
}

async function  statistics(req, res)  {
    const { month } = req.query;
    const startDate = new Date(`2021-${month}-01`);
    const endDate = new Date(`2022-${month}-31`);
  
    try {
      const totalSales = await Transaction.aggregate([
        { $match: { dateOfSale: { $gte: startDate, $lt: endDate } } },
        { $group: { _id: null, totalAmount: { $sum: "$price" }, soldItems: { $sum: { $cond: [ "$sold", 1, 0 ] } }, notSoldItems: { $sum: { $cond: [ "$sold", 0, 1 ] } } } }
      ]);
  
      res.json(totalSales[0]);
    } catch (error) {
      res.status(500).send('Error fetching statistics');
    }
  }

  async function barChart (req, res)  {
    const { month } = req.query;
    const startDate = new Date(`2021-${month}-01`);
    const endDate = new Date(`2022-${month}-31`);
  
    try {
      const barData = await Transaction.aggregate([
        { $match: { dateOfSale: { $gte: startDate, $lt: endDate } } },
        { $bucket: { groupBy: "$price", boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, Infinity], default: "901-above", output: { count: { $sum: 1 } } } }
      ]);
  
      res.json(barData);
    } catch (error) {
      res.status(500).send('Error fetching bar chart data');
    }
  };

async function pieChart (req, res) {
    const { month } = req.query;
    const startDate = new Date(`2021-${month}-01`);
    const endDate = new Date(`2022-${month}-31`);
  
    try {
      const pieData = await Transaction.aggregate([
        { $match: { dateOfSale: { $gte: startDate, $lt: endDate } } },
        { $group: { _id: "$category", count: { $sum: 1 } } }
      ]);
  
      res.json(pieData);
    } catch (error) {
      res.status(500).send('Error fetching pie chart data');
    }
  };

 async function combinedData(req, res)  {
    const { month } = req.query;
  
    try {
      const transactions = await axios.get(`http://localhost:${PORT}/api/transactions`, { params: { month } });
      const statistics = await axios.get(`http://localhost:${PORT}/api/statistics`, { params: { month } });
      const barChart = await axios.get(`http://localhost:${PORT}/api/bar-chart`, { params: { month } });
      const pieChart = await axios.get(`http://localhost:${PORT}/api/pie-chart`, { params: { month } });
  
      res.json({
        transactions: transactions.data,
        statistics: statistics.data,
        barChart: barChart.data,
        pieChart: pieChart.data
      });
    } catch (error) {
      res.status(500).send('Error fetching combined data');
    }
  };

  module.exports = { init,statistics,combinedData,pieChart,barChart,transaction}