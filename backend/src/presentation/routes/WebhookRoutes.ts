import { Router } from "express";
import express from 'express';
import container from '../../di/container';
import { TYPES } from "../../di/types";
import { WebhookController } from "../controllers/WebhookController";


const router=Router();
const controller=container.get<WebhookController>(TYPES.WebhookController);

router.post('/stripe',express.raw({type:'application/json'}),controller.handleStripeWebhook);

export default router;