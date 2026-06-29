---
name: paypal-sri-lanka-payee-limit
description: "PayPal can't RECEIVE into Sri Lanka accounts — affects Ovalen's real merchant account / go-live payment decision"
metadata: 
  node_type: memory
  type: project
  originSessionId: 05f1c67e-7d48-49bd-9668-d5b751743d09
---

User/business is in Sri Lanka. PayPal supports SENDING from SL but **not receiving** — an SL account can't be a payee (sandbox proved this: `PAYEE_ACCOUNT_RESTRICTED`, base64 in the genericError URL). Fixed for testing by creating a **US sandbox business account** + new REST app credentials.

**Buyers are NOT restricted:** anyone in any PayPal country (incl. SL) can pay; catalog stays USD and PayPal auto-converts the buyer's currency. The limitation is only the merchant/receiving side.

**Open go-live decision (deferred by user):** production needs a PayPal business account in a receive-supported country (US/UK/EU). If the real business must be SL-based, PayPal won't work for receiving → need an alternative gateway (PayHere, Onepay, or Payoneer/2Checkout). User chose: finish sandbox testing first, decide real merchant setup later. Part of [[ovalen-production-roadmap]]; payment integration details in [[security-hardening]].
