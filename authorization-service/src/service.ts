import * as dotenv from 'dotenv';
import { APIGatewayIAMAuthorizerResult, APIGatewayRequestIAMAuthorizerHandlerV2 } from "aws-lambda";

dotenv.config()

const generatePolicy = (principalId: string, effect: 'Allow' | 'Deny', resource: string): APIGatewayIAMAuthorizerResult => ({
    principalId: principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  });

const basicAuthorizer: APIGatewayRequestIAMAuthorizerHandlerV2 = (event, _, callback) => {
    if (event.type !== 'REQUEST') {
        callback('Unauthorized');
    }
    try {
        console.log("event ==>", event);
        let effect: "Deny" | "Allow" = 'Deny'
        let token = '';
        const { headers: { authorization }, routeArn } = event;
        if(authorization.includes(' ')){
          token = authorization.split(' ')[1];
          const decodedToken = atob(token);
          const [userName, password] = decodedToken.split("=")
          console.log(`Username: ${userName}; Password: ${password}`);
          if (password === process.env[userName] && password) {
              effect = 'Allow';
          }
        }
        const policy = generatePolicy(token, effect, routeArn);
        console.log(`Policy: ${JSON.stringify(policy)}`);
        callback(null, policy);
    } catch (error) {
        callback(`Unauthorized: ${error.message}`);
    }
}

export const AuthorizationService = {
    basicAuthorizer,
}
