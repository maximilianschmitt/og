const puppeteer = require('puppeteer')
const express = require('express')

class OGImageServer {
	constructor({ port }) {
		this.port = port
		this.browser = null
		this.app = express()
		this.server = null
		this.port = port
	}

	async start() {
		this.browser = await puppeteer.launch()

		this.app.get('/og-image', (req, res, next) => {
			const { text } = req.query

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
            `)
		})

		this.app.get('/v2/og-image', (req, res, next) => {
			const { text } = req.query

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

                            body {
                              -webkit-font-smoothing: antialiased;
                              -moz-osx-font-smoothing: antialiased;
                              font-smoothing: antialiased;
                            }

                            #og-image {
                                width: 1200px;
                                height: 630px;
                                background-color: black;
                                color: white;
                                font-size: 72px;
                                padding: 0 50px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                text-align: center;
                                font-weight: bold;
                                font-family: 'Helvetica Neue', Helvetica, sans-serif, Arial;
                                flex-direction: column;
                            }

                            .logo {
                              color: rgba(255, 255, 255, 0.6);
                              font-size: 36px;
                            }
                        </style>
                    </head>
                    <body>
                        <div id="og-image">
                          <span class="logo" style="margin-bottom: 1em;">Max Schmitt</span>
                          <span style="padding-bottom: 0.25em;">${text}</span>
                          <span class="logo" style="margin-top: 1em;">&nbsp;</span>
                        </div>
                    </body>
                </html>
            `)
		})

		this.app.get('/:text.png', async (req, res, next) => {
			try {
				const { text } = req.params

				return res.redirect(`https://maxschmitt.me/api/og?title=${encodeURIComponent(text)}`)
			} catch (err) {
				next(err)
			}
		})

		this.app.get('/v2/:text.png', async (req, res, next) => {
			try {
				const { text } = req.params

				return res.redirect(`https://maxschmitt.me/api/og?title=${encodeURIComponent(text)}`)
			} catch (err) {
				next(err)
			}
		})

		this.server = await new Promise((resolve, reject) => {
			const server = this.app.listen(this.port, (err) => {
				if (err) {
					return reject(err)
				}

				resolve(server)
			})
		})

		console.log(`OG Image Server listening on port ${this.port}`)
	}

	async getOGImageForText(text, mod = '') {
		const urlencodedText = encodeURIComponent(text)
		const page = await this.browser.newPage()
		await page.goto(`http://localhost:${this.port}${mod}/og-image?text=${urlencodedText}`)
		const ogImageElement = await page.$('#og-image')
		const image = await ogImageElement.screenshot()
		await page.close()
		return image
	}

	async stop() {
		await this.browser.close()
		this.server.close()

		this.app = null
		this.server = null
		this.browser = null
	}
}

module.exports = OGImageServer
