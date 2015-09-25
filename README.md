# transparent_cache_proxy
This is a node.js transparent cache proxy server. 

The proxy works on all CRUD requests but the cache only comes into effect on GET requests.

New requests store the response data in the cache. If the same request is made again the cache checks the destination URL for a 304 not modified before responding with it's own cached data. 

If the statusCode is not 200 then the cache updates it's data with the full response and promotes that element to the front of the list. 

Being a transparent cache, any time a cached response is called on it is promoted to the front of the list and it's expiriation time is reset.


## Installation

Clone this repository to your local machine. 

`git clone https://github.com/MooreJesseB/transparent_cache_proxy.git`

Then type `npm install` in your terminal.

## Usage

To run the server I prefer to use [nodemon](https://github.com/remy/nodemon). 

You can start the server by simply typing `nodemon` in your terminal.

If there is a permissions issue running the app start script then type the following instead: `nodemon ./app/app.js`

On a mac, to set this server as your computer's proxy go to `System Preferences -> Nework`. Then click the `advanced` button then the `proxies` tab.

Check the box next to `Web Proxy (HTTP)` and fill out the two fields under `Web Proxy Server` with `localhost` and port `3000`.

Click `OK` then click `Apply`.

Now all of your http traffic will be routed through the proxy server. Open chrome and start browsing!

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## History

TODO: Write history

## Credits

[Jesse Moore](https://github.com/MooreJesseB)

## License

The MIT License (MIT)

Copyright (c) 2015 Jesse Moore

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
