/*  Module Usage:
 *
 *  Define the product data, which will be present in product popup box
 *  To associate the date with project, attribute "data-productid" must be defined in <a> in "article" block as below.
 *
 *  <article class="item thumb" data-width="400">
 *      <h2>Samsung TV</h2>
 *      <a href="..." data-productid="lcdtv"><img src="images/thumbs/samsungtv.png" alt=""></a>
 *  </article>
 *  The value of "data-productid" must equal to corresponding key in "productData" object
*/

var productData = {
    lcdtv:
            "<div class='popupContent'>\
                <h2 class='caption'></h2>\
                <span>LCD TV Television Flat 32' HDTV</span>\
                <hr>\
                <div class='main'>\
                    <div class='left'>\
                        <h3 class='primary'><span>Chosen for you</span></h3>\
                        <p>We are tailoring the right product for the customer needs.</p>\
                        <h3><span>For private room</span></h3>\
                        <p>Because we know your room colors &amp; design stlye, accessories type, and best placement place on your room's wall</p>\
                        <h3><span>LCD Screen, 5ms response time</span></h3>\
                        <p>You usually don't have more than 2 hrs/day to watch TV, thats why we chose this TV, so you can enjoy the best view &amp; fastest response time when you spend it watching TV. </p>\
                        <h3><span>32 Inches, with lots of Plugs</span></h3>\
                        <p>Because you are usually like to sit in a distance of about 3 meters from your TV, and for the tech savvy inside you, you like to plug everything to it: Hard drives, streamers, smart TV dongles, computers, etc</p>\
                    </div>\
                    <div class='right'>\
                        <h3><span>Supports Full HD 1080p Resolution</span></h3>\
                        <p>You are using your TV mostly to watch movies, TV series and play games, so we offer you the best experience you can get for these needs, without compormising.</p>\
                        <h3><span>Price drop last year: 5%</span></h3>\
                        <p>We know that you are moving apartments every year, so we ensured that we chosen a product you can re-sell next year and save money for your new TV.</p>\
                        <h3><span>80% of TV's lasted longer than 10 years</span></h3>\
                        <p>Because this is not a new model, we want to make sure that you will encounter no errors using your device. You got a long way to go with this TV, if you want.</p>\
                    </div>\
                    <div class='center'>\
                        <div class='pic'></div>\
                        <h3><span>Only 199$</span></h3>\
                        <p>We are making our products affordable to everyone</p>\
                    </div>\
                    <div class='clearfloat'></div>\
                  </div>\
            </div>",

    iphone5:
            "<div class='popupContent'>\
                <h2 class='caption'></h2>\
                <span>Loving it is easy, That's why so many people do</span>\
                <hr>\
                <div class='main'>\
                    <div class='left'>\
                        <h3 class='primary'><span>Chosen for you</span></h3>\
                        <p>We are tailoring the right product for the customer needs.</p>\
                        <h3><span>For Young Audience</span></h3>\
                        <p>Young people need young & fashionable phones, thats why we chose the most beautiful phone designed to date</p>\
                        <h3><span>Full Network Coverage</span></h3>\
                        <p>You like to surf the web and download content from the internet at high-speeds, and because you are located on New York, we provided you a device with LTE capabilities </p>\
                        <h3><span>Light & Thin</span></h3>\
                        <p>We know that you are usually keeping your products safe, so we won't compormise on bigger & thicker device which can be more safe, maybe, but less comfortable to use.</p>\
                    </div>\
                    <div class='right'>\
                        <h3><span>iOS is simple</span></h3>\
                        <p>You had a bad experiment with Android devices before, the iPhone runs iOS operating system, which is very easy to use & operate</p>\
                        <h3><span>Save 200$ off the next phone you buy</span></h3>\
                        <p>We predict, according to market valuation and price drop rates in recent years, that the price of this iPhone will be around 200$ 3 years from now. Sell it in the 2nd hand market and get a new phone, 200$ off</p>\
                        <h3><span>Socially Active</span></h3>\
                        <p>You can connect to your accounts at Facebook, Twitter, Google Plus, LinkedIn, Vine & Instagram, or any other network using the iPhone 5, and stay updated with everything that is going on with your friends</p>\
                    </div>\
                    <div class='center'>\
                        <div class='pic'></div>\
                        <h3><span>Only 450$</span></h3>\
                        <p>Not a cheap phone, but not that expensive as well. you can afford it for yourself and enjoy 1 time every 3 years</p>\
                    </div>\
                    <div class='clearfloat'></div>\
                  </div>\
            </div>",
    
    legogasstation:
            "<div class='popupContent'>\
                <h2 class='caption'></h2>\
                <span>Lego 6397 Gas N Wash Express - Gas Station</span>\
                <hr>\
                <div class='main'>\
                    <div class='left'>\
                        <h3 class='primary'><span>Chosen for your kids</span></h3>\
                        <p>You have 2 boys, aged 9 and 11 who love Lego products. This specific product is suited for ages of 8-12</p>\
                        <h3><span>Enhance your Lego experiment</span></h3>\
                        <p>Based on your past Lego products, you assembled a small Lego city, and a few cars from Lego. With this kit, you can enrich your existing Lego set with a Gas station for your Lego cars.</p>\
                        <h3><span>435 Pieces</span></h3>\
                        <p>Wisely assemble the gas statoin using the components and the hundreds of pieces, promising lots of fun and creativity enrichment for you and your kids.</p>\
                    </div>\
                    <div class='right'>\
                        <h3><span>Quality and Safety is in the first place</span></h3>\
                        <p>LEGO primarily uses ABS plastic in its products. This material provides the unique connective grip, high gloss and colour stability properties of LEGO Group products. All raw materials and products are tested in internal and external laboratories</p>\
                        <h3><span>Gift for the next 10 years</span></h3>\
                        <p>Lego parts are known because of their durability and resistance. You can continue using this product in the next 10 years and likely nothing is going to happen to it.</p>\
                    </div>\
                    <div class='center'>\
                        <div class='pic'></div>\
                        <h3><span>Only 69$ Today</span></h3>\
                        <p>Complex set with lot of pieces for a special price</p>\
                    </div>\
                    <div class='clearfloat'></div>\
                </div>\
            </div>",
    
    barbieroom:
            "<div class='popupContent'>\
                <h2 class='caption'></h2>\
                <span>Barbie's Room</span>\
                <hr>\
                <div class='main'>\
                    <div class='left'>\
                        <h3 class='primary'><span>Chosen for your girl</span></h3>\
                        <p>Your girl watched the Barbie DVD yesterday, thats why we think this is the perfect gift for her</p>\
                        <h3><span>Popular accros the current location</span></h3>\
                        <p>We know that at least 67% of the girls in your daughter's class has various barbie sets. Would you leave it behind when you have a great chance to get the new set before everyone else?</p>\
                        <h3><span>Polish your creativity</span></h3>\
                        <p>Plan & Design the perfect Barbie house for Barbie & Ken. Let your children how to organize the house with all the items and furnitures </p>\
                    </div>\
                    <div class='right'>\
                        <h3><span>Dress your Barbie like others</span></h3>\
                        <p>See how your friends designed their barbie house and what style they applied for their Barbie, get inspiration for your unique Barbie doll</p>\
                        <h3><span>Suitable for your little daughter, too</span></h3>\
                        <p>Barbie Dolls are a are typically made from plastic vinyl and porcelain, promises usability and resistance to erosion during time and use, so you can even sell it again or save it for your little girl.</p>\
                        </div>\
                    <div class='center'>\
                        <div class='pic'></div>\
                        <h3><span>Only 99$ Today</span></h3>\
                        <p>Barbie houses are typically $129-$189 and up</p>\
                    </div>\
                    <div class='clearfloat'></div>\
                </div>\
            </div>",
    error:
            "<div class='popupContent'>\
                <h2 class='caption'>Error</h2>\
                <hr>\
                <div class='top'>\
                    <p>Attribute 'data-productid' is not configured properly</p>\
                </div>\
                <div class='main'>\
                    <div class='center'>\
                        <div class='pic' ></div>\
                    </div>\
                    <div class='clearfloat'></div>\
                </div>\
                <div class='bottom'>\
                </div>\
            </div>"
}