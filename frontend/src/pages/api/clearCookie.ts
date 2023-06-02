// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { deleteCookie } from 'cookies-next';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  deleteCookie('next-auth.session-token', {
    req,
    res,
  });
  res.status(200).json({ success: true });
}
