import 'dotenv/config';

export const appConfig = {
    bluedart: {
        apiKey: process.env.BLUEDART_API_KEY,
        apiSecret: process.env.BLUEDART_API_SECRET,
        thirdPartyLoginId: process.env.BLUEDART_THIRDPARTY_LOGINID,
        thirdPartySecret: process.env.BLUEDART_THIRDPARTY_KEY,
    }
}