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
        <span>Loving it is easy, That's why so many people do</span>\
        <hr>\
        <div class='main'>\
            <div class='left-2cols'>\
                <div class='viewbutton' style='background-image: url(images/products/iphone_sketchfab.jpg)'></div>\
                <div class='viewbutton' style='background-image: url(images/products/iphone1.jpg)'></div>\
                <div class='viewbutton' style='background-image: url(images/products/iphone2.jpg)'></div>\
                <div class='viewbutton' style='background-image: url(images/products/iphone3.jpg)'></div>\
            </div>\
            <div class='right-2cols'>\
              <h3><span>09/21/2012, The Verge:</span></h3>\
              <img src='http://www.allthingsroot.co.il/Catalog/images/products/iPhone5TheVerge.jpg' height='89' width='100' align='left'>\
              <p>''The iPhone 5 is unquestionably the best iPhone ever made, and for the mass market, it's the best smartphone, period. Between the new design, blazing fast LTE, and excellent battery life, there's little to not like here. It's a competent, confident, slick package''</p>\
              <h3><span>09/18/2012, Engadget:</span></h3>\
              <img src='http://www.allthingsroot.co.il/Catalog/images/products/iPhone5Engadget.gif' height='103' width='100' align='left'>\
              <p>''Will it wow you? Hold it in your hand -- you might be surprised. For the iOS faithful this is a no-brainer upgrade. This is without a doubt the best iPhone yet. This is a hallmark of design. This is the one you've been waiting for.''</p>\
              </div>\
            <div class='center-2cols'>\
              <div class='picblock'><img src='images/products/iphone_sketchfab.jpg' /></div>\
            </div>\
            <div class='clearfloat'></div>\
        </div>\
        <div>\
            <img id='image' style='width:100%' src='http://www.allthingsroot.co.il/Catalog/images/products/iPhone5Infographic.png' />\
        </div>\
        <div class='pic'></div>\
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
                        <h3><span>Only 69$ Today</span></h3>\
                        <p>Complex set with lot of pieces for a special price</p>\
                    </div>\
                    <div class='clearfloat'></div>\
                </div>\
                <div class='pic'></div>\
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
                        <h3><span>Only 99$ Today</span></h3>\
                        <p>Barbie houses are typically $129-$189 and up</p>\
                    </div>\
                    <div class='clearfloat'></div>\
                </div>\
                <div class='pic'></div>\
            </div>",
    iphone5:
        "<div class='popupContent'>\
            <h2 class='caption'></h2>\
            <span>Loving it is easy, That's why so many people do</span>\
            <hr>\
            <div class='main'>\
                <div class='left-2cols'>\
                    <div class='viewbutton' style='background-image: url(images/products/iphone_sketchfab.jpg)'></div>\
                    <div class='viewbutton' style='background-image: url(images/products/iphone1.jpg)'></div>\
                    <div class='viewbutton' style='background-image: url(images/products/iphone2.jpg)'></div>\
                    <div class='viewbutton' style='background-image: url(images/products/iphone3.jpg)'></div>\
                </div>\
                <div class='right-2cols'>\
                  <h3><span>09/21/2012, The Verge:</span></h3>\
                  <img src='http://www.allthingsroot.co.il/Catalog/images/products/iPhone5TheVerge.jpg' height='89' width='100' align='left'>\
                  <p>''The iPhone 5 is unquestionably the best iPhone ever made, and for the mass market, it's the best smartphone, period. Between the new design, blazing fast LTE, and excellent battery life, there's little to not like here. It's a competent, confident, slick package''</p>\
                  <h3><span>09/18/2012, Engadget:</span></h3>\
                  <img src='http://www.allthingsroot.co.il/Catalog/images/products/iPhone5Engadget.gif' height='103' width='100' align='left'>\
                  <p>''Will it wow you? Hold it in your hand -- you might be surprised. For the iOS faithful this is a no-brainer upgrade. This is without a doubt the best iPhone yet. This is a hallmark of design. This is the one you've been waiting for.''</p>\
                  </div>\
                <div class='center-2cols'>\
                  <div class='picblock'><img src='images/products/iphone_sketchfab.jpg' /></div>\
                </div>\
                <div class='clearfloat'></div>\
            </div>\
            <div>\
                <img id='image' style='width:100%' src='http://www.allthingsroot.co.il/Catalog/images/products/iPhone5Infographic.png' />\
            </div>\
            <div class='pic'></div>\
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