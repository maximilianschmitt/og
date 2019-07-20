const puppeteer = require("puppeteer");
const express = require("express");

class OGImageServer {
  constructor({ port }) {
    this.port = port;
    this.browser = null;
    this.app = express();
    this.server = null;
    this.port = port;
  }

  async start() {
    this.browser = await puppeteer.launch();

    this.app.get("/og-image", (req, res, next) => {
      const { text } = req.query;

      res.status(200).send(`
                <!DOCTYPE html>
                <html lang="en">
                    <head>
                        <meta charset="UTF-8" />
                        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
                        <title>${text}</title>
                        <style>
                            * {
                                padding: 0;
                                margin: 0;
                                box-sizing: border-box;
                            }

                            #og-image {
                                width: 1200px;
                                height: 630px;
                                border: 2px solid black;
                                color: black;
                                font-size: 72px;
                                padding: 0 50px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                text-align: center;
                                font-weight: bold;
                                font-family: 'Helvetica Neue', Helvetica, sans-serif, Arial;
                            }
                        </style>
                    </head>
                    <body>
                        <div id="og-image">${text}</div>
                    </body>
                </html>
            `);
    });

    this.app.get("/:text.png", async (req, res, next) => {
      try {
        const { text } = req.params;

        const image = await this.getOGImageForText(text);

        res.send(image);
      } catch (err) {
        next(err);
      }
    });

    this.server = await new Promise((resolve, reject) => {
      const server = this.app.listen(this.port, err => {
        if (err) {
          return reject(err);
        }

        resolve(server);
      });
    });

    console.log(`OG Image Server listening on port ${this.port}`);
  }

  async getOGImageForText(text) {
    const urlencodedText = encodeURIComponent(text);
    const page = await this.browser.newPage();
    await page.goto(
      `http://localhost:${this.port}/og-image?text=${urlencodedText}`
    );
    const ogImageElement = await page.$("#og-image");
    const image = await ogImageElement.screenshot();
    await page.close();
    return image;
  }

  async stop() {
    await this.browser.close();
    this.server.close();

    this.app = null;
    this.server = null;
    this.browser = null;
  }
}

module.exports = OGImageServer;
