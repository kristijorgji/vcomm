import {NextApiRequest, NextApiResponse} from "next";
import data from "../../../packages/local/src/data.json";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  return res.status(200).json(data.products);
};

export default handler;
