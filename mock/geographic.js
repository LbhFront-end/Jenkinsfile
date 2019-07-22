/* eslint-disable global-require */
import city from './geographic/city.json';
import province from './geographic/province.json';


function getProvince(req, res) {
  return res.json(province);
}

function getCity(req, res) {
  return res.json(city[req.params.province]);
}

function getRegion(req){
 const {regionId} = req.params;
 let data;
 if(regionId){
  data = require(`../../../mock/regions/region.json`);
 }else{
  // eslint-disable-next-line import/no-dynamic-require
  data = require(`../../../mock/regions/region/region${regionId}.json`);
 }
return data;
}

export default {
  'GET /api/geographic/province': getProvince,
  'GET /api/geographic/city/:province': getCity,
  'GET /data/region.json': getRegion,
  'GET /data/region/:regionId.json': getRegion,
};
