Vue.component('product-review', {
    template: `
        <div> 
            <form class="review-form" @submit.prevent="onSubmit">
                <p v-if="errors.length">
                    <b>Please correct the following error(s):</b>
                    <ul>
                        <li v-for="error in errors">{{ error }}</li>
                    </ul>
                </p>

                <p>
                    <label for="name">Name:</label>
                    <input v-model="name"> 
                </p>

                <p>
                    <label for="review">Review:</label>
                    <textarea id="review" v-model="review"></textarea>
                </p>

                <p>
                    <label for="rating">Rating:</label>
                    <select id="rating" v-model.number="rating">
                        <option>5</option>
                        <option>4</option>
                        <option>3</option>
                        <option>2</option>
                        <option>1</option>
                    </select>
                </p>

                <p>Would you recommend this product?</p>
                <label>
                    Yes
                    <input type="radio" value="Yes" v-model="recommend" />
                </label>
                <label>
                    No
                    <input type="radio" value="No" v-model="recommend" />
                </label>

                <p>
                    <input type="submit" value="Submit">
                </p>

            </form>
        </div>
    `
    ,data() {
        return {
            name: null
            ,review: null
            ,rating: null
            ,recommend: null
            ,errors: []
        }
    }
    ,methods: {
        onSubmit() {
            if (this.name && this.review && this.rating && this.recommend) { 
                let productReview = {
                    name: this.name
                    ,review: this.review
                    ,rating: this.rating
                    ,recommend: this.recommend
                } 

                this.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
                this.recommend = null
            }
            else {
                if(!this.name) this.errors.push("Name required.")
                if(!this.review) this.errors.push("Review required.")
                if(!this.rating) this.errors.push("Rating required.") 
                if(!this.recommend) this.errors.push("Recommend required.") 
            }
            
        }
    }
})

Vue.component('product-details', {
    props: {
        details: {
            type: Array
            ,require: true
        }
    }
    ,template: `
        <ul>
            <li v-for="detail in details">
                    {{ detail }}
            </li>
        </ul>
    `
})

Vue.component('product', {
    props: {
        premium: {
            type: Boolean
            ,require: true
        }
    }
    ,template: ` 
        <div class="product"> 
            <div class="product-image">
                <img v-bind:src="image" alt="#">
            </div>

            <div class="product-info">
                <h1>{{ title }}</h1>
                <p v-if="inStock">In stock</p>
                <p v-else-if="inventory <= 10 && inventory >0">Almost sold out</p>
                <p v-else>Out of stock</p>
                <p> {{ sale }} </p>
                <p> Shipping: {{ shipping }} </p>

                <product-details :details="details"></product-details>

                <div v-for="variant, index in variants" 
                    :key="variant.variantID"
                    class="color-box"	
                    :style="{ backgroundColor : variant.variantColor }" 
                    @mouseover="updateProduct(index)"> 
                </div>

                <button 
                    v-on:click="addToCart"
                    :disabled="!inStock"
                    :class="{ disabledButton: !inStock }">
                    Add to Cart
                </button>
                <button v-on:click="removeToCart">remove to Cart</button>


            </div>

            <product-tabs></product-tabs>

            <div>
                <h2>Reviews</h2>
                <p v-if="!reviews.length">There are no reviews yet.</p>
                <ul>
                    <li v-for="review in reviews">
                        <p>{{ review.name }}</p>
                        <p>{{ review.rating }}</p>
                        <p>{{ review.review }}</p>
                        <p>{{ review.recommend }}</p>
                    </li>
                </ul>
            </div>            
            <product-review @review-submitted="addReview"></product-review>

        </div>
    `
    ,data() {
        return { 
            brand: 'Vue Mastery'
            ,product: 'Socks'
            ,selectVariant: 0
            ,link: 'https://www.google.co.th'
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
                    ,varianQty: 10
                }
                ,{
                    variantID: 2235
                    ,variantColor: "blue"
                    ,varianImage: './assets/vmSocks-blue-onWhite.jpg'
                    ,varianQty: 10
                }
            ]
            ,onSale: false
            ,reviews: []
        }
    }
    ,methods: {
        addToCart() {
            // this.cart += 1

            this.$emit(
                'add-to-cart'
                ,this.variants[this.selectVariant].variantID
            )
        }
        ,updateProduct(index) {
            this.selectVariant = index
        }
        ,removeToCart() {
            this.$emit(
                'remove-from-cart'
                ,this.variants[this.selectVariant].variantID
            )
        }
        ,addReview(productReview) {
            this.reviews.push(productReview)
        }
    }
    ,computed: {
        title() {
            return this.brand + ' ' + this.product
        }
        ,image() {
            return this.variants[this.selectVariant].varianImage
        }
        ,inStock() {
            return this.variants[this.selectVariant].varianQty
        }
        ,sale() {
            let msg = 'are on sale!'
            if (!this.onSale) {
                msg = 'are not on sale'
            }

            return this.brand + ' ' + this.product + msg
        }
        ,shipping() {
            if (this.premium) {
               return "Free" 
            }
            return 2.99
        }
    }
}) 

Vue.component('product-tabs', {
    template: `
    <div>
        <span class="tab" 
            :class="{activeTab: selectedTab === tab}"
            v-for="(tab, index) in tabs" 
            :key="index"
            @click="selectedTab=tab">
            {{ tab }}
        </span>
    </div>
    `
    ,data() {
        return {
            tabs: ['Reviews', 'Make a Review']
            ,selectedTab: 'Reviews'
        }
    }
})

var app = new Vue({
    el: '#app'
    ,data: {
        premium: false
        ,cart: []
        ,remove: []
    }
    ,methods: {
        updateCart(id) {
            this.cart.push(id)
        }
        ,removeCart(id) {
            this.remove.push(id)
            for(var i = this.cart.length - 1; i >= 0; i--) {
                if(this.cart[i] === id) {
                    this.cart.splice(i, 1)
                }
            }
        }
    }

})