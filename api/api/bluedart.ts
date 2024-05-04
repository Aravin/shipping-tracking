import { Request, Response } from 'express';
import axios from 'axios';
import xml2js from 'xml2js';
import { appConfig } from '../config';

const BLUEDART_HOST = 'https://apigateway.bluedart.com/in/transportation';

// gen token
const genToken = async () => {

  const config = {
    method: 'get',
    url: `${BLUEDART_HOST}/token/v1/login`,
    headers: {
      'ClientID': appConfig.bluedart.apiKey,
      'clientSecret': appConfig.bluedart.apiSecret,
    }
  };

  const response = await axios.request(config);
  return response.data;
}

// get tracking info
const getTrackingInfo = async (token: string, awb: string) => {

  const config = {
    method: 'get',
    url: `${BLUEDART_HOST}/tracking/v1/shipment?scan=1&numbers=${awb}&handler=tnt&loginid=${appConfig.bluedart.thirdPartyLoginId}&action=custawbquery&verno=1.3&awb=awb&lickey=${appConfig.bluedart.thirdPartySecret}`,
    headers: {
      'JWTToken': token,
    }
  };

  const response = await axios.request(config);
  return response.data;
}

function xmlToJson(xmlString: string) {
  const parser = new xml2js.Parser();
  return new Promise((resolve, reject) => {
    parser.parseString(xmlString, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.stringify(result, null, 2));
      }
    });
  });
}

export const bluedart = async (req: Request, res: Response) => {

  try {
    if (!req.query.awb) {
      res.status(400).send('AWB is required');
    }

    const tokenResponse = await genToken();

    if (!tokenResponse || !tokenResponse.JWTToken) {
      res.status(400).send('Unable to connect to bluedart');
    }

    const trackingResponse = await getTrackingInfo(tokenResponse.JWTToken, req.query?.awb + '');
    const jsonTrackingData = await xmlToJson(trackingResponse) as string;

    res.status(200).jsonp(JSON.parse(jsonTrackingData));

  } catch (err) {
    // console.log(err);
    res.status(500).send('Unable to process the request');
  }
};
