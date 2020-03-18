import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'
//import { decode } from 'jsonwebtoken'
//import { verify, decode } from 'jsonwebtoken'
import { verify } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import * as middy from 'middy' 
import { secretsManager } from 'middy/middlewares'
import { JwtPayload } from '../../auth/JwtPayload'
//import Axios from 'axios'
//import { Jwt } from '../../auth/Jwt'
//import { JwtPayload } from '../../auth/JwtPayload'

 
const logger = createLogger('auth')
const secretId = process.env.AUTH_0_SECRET_ID
const secretField = process.env.AUTH_0_SECRET_FIELD

// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
//const jwksUrl = 'https://dev-nb46-pro.auth0.com/.well-known/jwks.json'
 
export const handler = middy(async (event: CustomAuthorizerEvent, context): Promise<CustomAuthorizerResult> => {
//export const handler = async (  event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {

    const decodedToken = verifyToken(
      event.authorizationToken,
      context.AUTH0_SECRET[secretField]
    )

    //const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', decodedToken)

    return {
      principalId: decodedToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
})

/*async function verifyToken(authHeader: string): Promise<JwtPayload> {  
    
  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  if (!authHeader)
    throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]
  return verify(token, auth0Secret) as JwtPayload
  //return verify(token, jwksUrl, { algorithms: ['RS256'] }) as JwtPayload
  
}*/
 
function verifyToken(authHeader: string, secret: string): JwtPayload {
  if (!authHeader)
    throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return verify(token, secret) as JwtPayload
}

handler.use(
  secretsManager({
    cache: true,
    cacheExpiryInMillis: 60000,
    // Throw an error if can't read the secret
    throwOnFailedCall: true,
    secrets: {
      AUTH0_SECRET: secretId
    }
  })
)
