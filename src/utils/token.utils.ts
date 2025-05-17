import { create, Payload, verify } from '../../deps.ts';

const secret = Deno.env.get('CRYPTO_SECRET');
if (!secret) {
  throw new Error('CRYPTO_SECRET environment variable not set.');
}

const secretArray = new Uint8Array(
  atob(secret)
    .split('')
    .map((char) => char.charCodeAt(0)),
);

const cryptoKey = await crypto.subtle.importKey(
  'raw',
  secretArray,
  { name: 'HMAC', hash: 'SHA-256' },
  false,
  ['sign', 'verify'],
);

export const generateToken = async (payload: Payload) => {
  return await create({ alg: 'HS256', typ: 'JWT' }, payload, cryptoKey);
};

export const verifyToken = async (token: string, key = cryptoKey) => {
  return await verify(token, key);
};
