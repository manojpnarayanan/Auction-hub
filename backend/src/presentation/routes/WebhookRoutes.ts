import { Router } from "express";
import express from 'express';
import container from '../../di/container';
import { TYPES } from "../../di/types";
import { WebhookController } from "../controllers/WebhookController";
import { ROUTES } from "../Constant-Route/routes";

const router=Router();
const controller=container.get<WebhookController>(TYPES.WebhookController);

router.post(ROUTES.COMMON.WEBHOOK,express.raw({type:'application/json'}),controller.handleStripeWebhook);

export default router;