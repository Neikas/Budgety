var budgetController = (function () {

    var Expense = function(id, desscription, value) {
        this.id = id;
        this.desscription = desscription;
        this.value = value;
        this.percentage = -1;
    };
    Expense.prototype.calcPercentages = function(totalIncome) {
        if(totalIncome > 0){
            this.percentage = Math.round( (this.value / totalIncome) * 100 );
        } else {
            this.percentage = -1;
        }
    };
    Expense.prototype.getPercentage = function () {
        return this.percentage;
    }
    var Income = function(id, desscription, value) {
        this.id = id;
        this.desscription = desscription;
        this.value = value;
    };

    var calculateTotal = function(type) {
        var sum = 0;

        data.allItems[type].forEach(function(current) {
            sum += current.value;
        });
        data.totals[type] = sum;
    };

    var data = {
        allItems:{
            exp: [],
            inc: []
        },
        totals:{
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
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
        deleteItem: function (type, ID) {
            var ids, index;
            //data.allItems[type][ID]

            ids = data.allItems[type].map(function( current){
                return current.id;
            });

            index = ids.indexOf(ID);

            if(index !== -1){
                data.allItems[type].splice(index, 1);
            }
        },
        calculateBudget: function () {
            //calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            //calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            //calculate the precentage of income that we spent
            if(data.totals.inc > 0){
                data.percentage =Math.round((data.totals.exp / data.totals.inc) * 100);
            }else {
                data.percentage = -1;
            }
            
        },
        calculatePercentages: function () {
            
            data.allItems.exp.forEach(function(cur) {
                cur.calcPercentages(data.totals.inc);
            });

        },
        getPercentages: function() {
            var allPerc = data.allItems.exp.map(function (cur) {
                return cur.getPercentage();
            });
            return allPerc;
        },
        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
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
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel:'.budget__value',
        incomeLabel:'.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        precentageLabel:'.budget__expenses--percentage',
        container: '.container',
        expensesPercLable: '.item__percentage'

    }; 


    //some code later!
    return {
        getinput: function(){
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                desscription: document.querySelector(DOMstrings.inputDescription).value,
                value : parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
        },
        addListItem: function(obj, type) {
            var html , newHtml, element;
            // html string
            if(type === 'inc' ) {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div>'+
                '<div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete">'+
                '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }else if (type === 'exp') {
                
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div>'+
                '<div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div>'+
                '<div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // Replace the placholder text with some actual data
            newHtml = html.replace( '%id%' , obj.id);
            newHtml = newHtml.replace('%description%' , obj.desscription);
            newHtml = newHtml.replace('%value%', obj.value);
            //inset text
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        deleteListItem: function(selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },  
        getDOMstrings: function() {
            return DOMstrings;
        },
        displayPercentages: function (percentages) {
            var fields;
            fields = document.querySelectorAll(DOMstrings.expensesPercLable);

            var nodeListForEach = function(list, callback) {

                for(var i = 0; i < list.length; i++){
                    callback(list[i] , i);
                }
            };

            nodeListForEach(fields, function(current, index){
                
                if(percentages[index] > 0 ){
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });

        },
        displayBudget: function(obj) {
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expenseLabel).textContent = obj.totalExp;
            
            
            if(obj.percentage > 0 ) {
                document.querySelector(DOMstrings.precentageLabel).textContent = obj.percentage + '%';
            }else {
                document.querySelector(DOMstrings.precentageLabel).textContent = '---';
            }
        },
        clearFields: function() {
            var fields, fieldsArray;
            fields = document.querySelectorAll(DOMstrings.inputDescription +', ' + DOMstrings.inputValue);

            fieldsArray = Array.prototype.slice.call(fields);

            fieldsArray.forEach(function(current, index, array) {
                current.value = "";
            });
            fieldsArray[0].focus();
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

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);


    }
    var updateBudget = function () {
        var budget;

        //1. Calculate the budget
        budgetController.calculateBudget();

        //2. Return the budget
        budget = budgetController.getBudget();
        //3. Display the budget on the UI
        UIController.displayBudget(budget);
    };
    var updatePercentages = function () {
        //callculate percentages
        budgetCtrl.calculatePercentages();
        //reat percentages form the budget controller
        var percentage = budgetCtrl.getPercentages();

        //update the ui with the new percentages

        UIController.displayPercentages(percentage);
    };
    var ctrlAddItem = function() {
        var input , newItem;
        //1. Get the filed input data
        input = UIController.getinput();


        if(input.desscription !== "" && !isNaN(input.value) && input.value > 0 ){
            //2. Addd the item to the budget controller
            newItem = budgetController.addItem(input.type, input.desscription, input.value);
            //3. Add the item to the UI
            UIController.addListItem(newItem, input.type);
            //4. cliering fields
            UIController.clearFields();
            //5. calculate and update budget
            updateBudget();
            //5 Calculate and update percentages
            updatePercentages();
        }


    };

    var ctrlDeleteItem = function(event) {
        var itemID , splidID, type ,ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemID){

            splidID =itemID.split('-');
            type = splidID[0];
            ID = parseInt(splidID[1]);

            // Delete item from the data structutre
            budgetController.deleteItem(type, ID);
            // Delete th item form the UI
            UIController.deleteListItem(itemID);
            // Update ad show the mew budget
            updateBudget();

        }
    }

    return {
        init: function() {
            console.log('Application has started');
            setupEventListeners();
        }
    };


})(budgetController, UIController);


contorller.init();