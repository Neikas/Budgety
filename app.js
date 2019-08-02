var budgetController = (function () {

    var Expense = function(id, desscription, value) {
        this.id = id;
        this.desscription = desscription;
        this.value = value;
    };

    var Income = function(id, desscription, value) {
        this.id = id;
        this.desscription = desscription;
        this.value = value;
    };
    
    var data = {
        allItems:{
            exp: [],
            inc: []
        },
        totals:{
            exp: 0,
            inc: 0
        }
    }

    return {
        addItem: function(type , des , val) {
            var newItem, ID;

            //create id
            if(data.allItems[type].length > 0 ){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }else {
                ID = 0 ;
            }
           
            if(type === 'exp'){
                newItem = new Expense(ID , des, val)
            }else if (type === 'inc') {
                newItem = new Income(ID , des, val);
            }
            
            data.allItems[type].push(newItem);

            return newItem;
        },
        testing:function() {
            console.log(data);
        }
    }
})();

var UIController = (function() {
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    }; 


    //some code later!
    return {
        getinput: function(){
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                desscription: document.querySelector(DOMstrings.inputDescription).value,
                value : document.querySelector(DOMstrings.inputValue).value
            }
        },
        getDOMstrings: function() {
            return DOMstrings;
        }
    }


})();


//APP controller
var contorller = (function(budgetCtrl, UICtrl){
    var setupEventListeners = function() {
        var DOM = UIController.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click' , ctrlAddItem);
        document.addEventListener('keypress' , function(event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
    }

    var ctrlAddItem = function() {
        var input , newItem;
        //1. Get the filed input data
        input = UIController.getinput();

        //2. Addd the item to the budget controller
        newItem = budgetController.addItem(input.type, input.desscription, input.value);
        //3. Add the item to the UI
        //4. Calculate the budget
        //5. Display the budget on the UI

    };

    return {
        init: function() {
            console.log('Application has started');
            setupEventListeners();
        }
    };


})(budgetController, UIController);


contorller.init();