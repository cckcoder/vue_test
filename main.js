var app = new Vue({
    el: '#app'
    ,data: {
        product: 'Socks'
        ,image : './assets/vmSocks-green-onWhite.jpg'
        ,link: 'https://www.google.co.th'
        ,inStock: true
        ,inventory: 100
        ,details: [
            "81% cotton"
            ,"20% polyester"
            ,"Gender-neutral"
        ]
        ,variants: [
            {
                variantID: 2234
                ,variantColor: "green"
								,varianImage: './assets/vmSocks-green-onWhite.jpg'
            }
            ,{
                variantID: 2235
                ,variantColor: "blue"
								,varianImage: './assets/vmSocks-blue-onWhite.jpg'
            }
        ]
        ,cart:0
    }
    ,methods: {
        addToCart() {
            this.cart += 1
      }
			,updateProduct(varianImage) {
					this.image = varianImage	
			}
			,removeToCart() {
					if(this.cart == 0)
					{
						return this.cart;
					}

					this.cart -= 1	
			}
    }
});