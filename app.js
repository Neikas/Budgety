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
        precentageLabel:'.budget__expenses--percentage'

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
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div>'+
                '<div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete">'+
                '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }else if (type === 'exp') {
                
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div>'+
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
        getDOMstrings: function() {
            return DOMstrings;
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
    }
    var updateBudget = function () {
        var budget;

        //1. Calculate the budget
        budgetController.calculateBudget();

        //2. Return the budget
        budget = budgetController.getBudget();
        //3. Display the budget on the UI
        UIController.displayBudget(budget);
    }
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
        }


    };

    return {
        init: function() {
            console.log('Application has started');
            setupEventListeners();
        }
    };


})(budgetController, UIController);


contorller.init();