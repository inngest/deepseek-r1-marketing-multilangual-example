# Marketing Multilingual Generator

This example demonstrates how to build an Marketing Multilingual Generator using Inngest and the DeepSeek R1 model. The generator will generate marketing content in multiple languages, adapting the tone and style to the target audience.

Requirements
To successfully follow this tutorial, you will need the following:

- Git installed
- Node 22+
- `pnpm`
- An Inngest account (for deployment)
- A Koyeb account (for the DeepSeek-R1 QWEN 32b model)

## Deploying the DeepSeek-R1 QWEN 32b model

Use the link below to deploy the DeepSeek-R1 QWEN 32b model to Koyeb in one-click:

[Deploy the model on Koyeb](https://app.koyeb.com/deploy?type=model&model=deepseek-r1-qwen-32)

From there, you can choose to either run the application locally or deploy it to Koyeb.

## Deploying the application

Deploy the application to Koyeb using the following button:

[![Deploy to Koyeb](https://www.koyeb.com/static/images/deploy/button.svg)](https://app.koyeb.com/deploy?type=git&repository=inngest/deepseek-r1-marketing-multilingual-example&branch=main&name=marketing-multilingual-generator)

Then, once your application is deployed, login into your Inngest dashboard and configure a new sync using the following url:

```
https://<YOUR_DOMAIN_PREFIX>.koyeb.app/api/inngest
```

Once the sync successful, navigate to the Functions tabs and invoke the `generate-multilingual-campaign` function with this payload:

```json
{
  "data": {
    "brandInfo": "Inngest is the developer platform for easily building reliable workflows with zero infrastructure.\n\nShipping reliable background jobs and workflows are a time consuming and frustrating experience for any software team. Local development is painful. Managing infrastructure is tedious. Days to weeks of developer time is lost doing this work at every company.\n\nInngest is solving this problem for every software team, no matter team size or experience.",
    "campaignGoal": "Target CTO, Architect and Founders building AI B2B products.",
    "targetLanguages": ["Germany", "France", "England"]
  }
}
```

You should be redirected to the Runs view and see your workflow run.

## Running the application locally

### Installation

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Configure the deployed model URL in the `.env` file:

```bash
DEEPSEEK_API_KEY=test
DEEPSEEK_BASE_URL=https://<YOUR_DOMAIN_PREFIX>.koyeb.app/v1
```

### Running the Application

1. Start the development server:

   ```bash
   pnpm dev
   ```

2. Start the Inngest Dev Server:

```bash
npx inngest-cli@latest dev
```

### Usage

Open the browser and navigate to `http://127.0.0.1:8288/` to access the Inngest Dev Server.

Navigate to the Functions tabs and invoke the `generate-multilingual-campaign` function with this payload:

```json
{
  "data": {
    "brandInfo": "Inngest is the developer platform for easily building reliable workflows with zero infrastructure.\n\nShipping reliable background jobs and workflows are a time consuming and frustrating experience for any software team. Local development is painful. Managing infrastructure is tedious. Days to weeks of developer time is lost doing this work at every company.\n\nInngest is solving this problem for every software team, no matter team size or experience.",
    "campaignGoal": "Target CTO, Architect and Founders building AI B2B products.",
    "targetLanguages": ["Germany", "France", "England"]
  }
}
```

You should be redirected to the Runs view and see your workflow run.

---

[LICENSE - Apache 2.0](./LICENSE)
