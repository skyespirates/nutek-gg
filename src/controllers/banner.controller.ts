import { Request, Response } from "express";
import { response } from "../utils/response";
import { BannerResp, Service } from "../types";
import bannerService from "../services/banner.service";

async function list(req: Request, res: Response) {
  const banners = await bannerService.list();
  let resp: BannerResp[] = [];
  for (const b of banners) {
    const tmp: BannerResp = {
      banner_name: b.name,
      banner_image: b.image,
      description: b.description,
    };
    resp.push(tmp);
  }

  response<BannerResp[]>(res, 200, 0, "Sukses", resp);
}

export default {
  list,
};
