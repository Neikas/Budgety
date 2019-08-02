var budgetController = (function () {

    //some code 

})();




var UIController = (function() {


    //some code later!
    return {
        getinput: function(){
            return {
                type: document.querySelector('.add__type').value,
                desscription: document.querySelector('.add__description').value,
                value : document.querySelector('.add__value').value
            }
    

        }
    }


})();


//APP controller
var contorller = (function(budgetCtrl, UICtrl){
    var ctrlAddItem = function() {
        //1. Get the filed input data
        var input = UIController.getinput();
        console.log(input);

        //2. Addd the item to the budget controller
        //3. Add the item to the UI
        //4. Calculate the budget
        //5. Display the budget on the UI

    };

    document.querySelector('.add__btn').addEventListener('click' , ctrlAddItem);
    document.addEventListener('keypress' , function(event) {
        if (event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();
        }
    });
})(budgetController, UIController);
