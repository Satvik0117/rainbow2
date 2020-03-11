module.exports = function Cart(oldCart){
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || parseInt('0');
    this.totalPrice = oldCart.totalPrice || parseInt('0');

    this.add = function(item, id){
        var storedItem = this.items[id];
        if(!storedItem){
            storedItem = this.items[id] = {item: item, qty: 0, price: 0 };
        }
        console.log(storedItem.item.discounted_price);
        storedItem.qty++;
        storedItem.price = storedItem.item.discounted_price * storedItem.qty;
        this.totalQty++;
        this.totalPrice =this.totalPrice + parseInt(storedItem.item.discounted_price);
    };

    this.reduceByOne = function(id){
        this.items[id].qty--;
        this.items[id].price = this.items[id].price - parseInt(this.items[id].item.discounted_price);
        this.totalQty--;
        this.totalPrice = this.totalPrice - parseInt(this.items[id].item.discounted_price);
        
        if(this.items[id].qty <= 0){
            delete this.items[id];
        }
    }

    this.removeItem = function(id){
        this.totalQty -= this.items[id].qty;
        this.totalPrice = this.totalPrice - parseInt(this.items[id].price);


        delete this.items[id];
    }

    this.generateArray = function(){
        var arr = [];
        for(var id in this.items){
            arr.push(this.items[id]);
        }
        return arr;
    };
};