import { Request, Response } from "express";
import serviceService from "../services/service.service";
import { success } from "../utils/response";
import { SerivceResp, Service } from "../types";

async function list(req: Request, res: Response) {
  const svc = await serviceService.list();

  let services: SerivceResp[] = [];
  for (let s of svc) {
    const service: SerivceResp = {
      service_code: s.code,
      service_name: s.name,
      service_icon: s.icon,
      service_tariff: s.tariff,
    };
    services.push(service);
  }

  success<SerivceResp[]>(res, 200, "Sukses", services);
}

export default {
  list,
};
