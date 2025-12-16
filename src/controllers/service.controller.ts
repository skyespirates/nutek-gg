import { Request, Response } from "express";
import serviceService from "../services/service.service";
import { success } from "../utils/response";
import { Service } from "../types";

async function list(req: Request, res: Response) {
  const services = await serviceService.list();

  success<Service[]>(res, 200, "Sukses", services);
}

export default {
  list,
};
