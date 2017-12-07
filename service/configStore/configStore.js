'use strict';

const express = require('express');
const Tools = require('./configTools');


const configRouter = express.Router();


configRouter.get('/', (req, res) => {
  res.json(Tools.getAll());
});

configRouter.post('/', (req, res) => {
  const mac = req.body.mac;
	const name = req.body.name;
	const regexp = req.body.regexp;


		res.send(Tools.createConfEntry(mac,name,regexp));

});

configRouter.route('/validDevice/:mac')
.post((req, res) => {
  const macAddr = req.params.mac;
  res.json(Tools.setConfigured(macAddr));
})
.delete((req,res) => {
  const macAddr = req.params.mac;
  res.json(Tools.setUnconfigured(macAddr));
  }
);

configRouter.route('/mac/:mac')
	.get((req, res) => {
	const macAddr = req.params.mac;
 	res.json(Tools.getByMac(macAddr));
})
	.delete((req, res) => {
    const macAddr = req.params.mac;
		res.json(Tools.deleteByMac(macAddr));

	});


module.exports = configRouter;
