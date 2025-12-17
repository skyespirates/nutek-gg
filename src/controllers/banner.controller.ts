import { Request, Response } from "express";
import { success } from "../utils/response";
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

  success<BannerResp[]>(res, 200, "Sukses", resp);
}

export default {
  list,
};
