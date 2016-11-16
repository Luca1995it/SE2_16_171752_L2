//-------- DECLARATIONS --------//

//link to the order-table
var table2 = document.getElementById("table2");

//link to the warehouse table
var original = document.getElementById("original");

//link to the error message to show if the user insert wrong values in the order table
var errorMessage = document.getElementById("errorMessage");

//link to the displayButton. It shows the order-table if clicked
var displayButton = document.getElementById("displayButton");

//link to the orderButton. It adds the items in the order-table to the warehouse if clicked
var orderButton = document.getElementById("orderButton");

//links to the inputs fields
var itemName = document.getElementById("itemName");
var itemNumber = document.getElementById("itemNumber");

//links to set the max number of items in the warehouse and display it with maxNum
var maxNum = document.getElementById("maxNum");
var setMax = document.getElementById("setMax");

//link to the error message of the set max function
var errMessage = document.getElementById("errMessage");

//the max number of items in the warehouse, default 1000
var max = 1000;

//displaing the default value of Max
maxNum.innerHTML = "Max: " + max;

//matrix stores the items in the warehouse. It contains tuples (name: string,quantity: integer)
var matrix = [];

//message to show if the warehouse is empty instead of the table with Name and Quantity
var emptyMessage = "Empty chart";

//-------- END OF DECLARATIONS --------//


//-------- INITIALIZATIONS --------//

//initializing tables in the html file
drawChart(matrix,original);

//-------- END OF INITIALIZATIONS --------//


//-------- FUNCTIONS --------//

/**
 * @brief function called to display the order-table and the orderButton
 */
function display() {
    //showing the order-items, hidding the displayButton and cleaning inputs field
    itemName.value = "";
    itemNumber.value = "";
    table2.style.display = 'block';
    orderButton.style.display = 'block';
    displayButton.style.display = 'none';
}

/**
 * @brief function called to send the order and hide the order-table and the orderButton again
 */
function order(){
    //reset the error message to empty message
    errorMessage.innerHTML = "";
        
    //sox is a matrix containing the order-table values inserted by the user
    var sox = acquire();
    
    //validation returns true if the data inserted by the user are in the correct form, false otherwise
    if(validation(sox)){
            
        //controlling not to overflow the limit
        if(test(sox)){
            
            //adding the new item to the warehouse
            addElement(matrix,sox);
        
            //updating warehouse on the html page
            drawChart(matrix,original);
            
            //hidding the order-items and showing again the displayButton
            table2.style.display = 'none';
            orderButton.style.display = 'none';
            displayButton.style.display = 'block';
        } else{
            //the error message to show if the new order by the user were inserted in a wrong form
            errorMessage.innerHTML = "Stai superando il limite di oggetti nel carrello";
        }
        
    }else{
        //the error message to show if the new order by the user were inserted in a wrong form
        errorMessage.innerHTML = "Inserisci i dati nel giusto modo: lettera | numero > 0";
    }
}

/**
 * @brief test if the number of items of the new order is permitted by the limit
 * @return Yes if the number of new items + numbers of items in the warehouse does not exeed the limit (<=)
 */
function test(tuple){
    return ((parseInt(tuple[1]) + getNumberOfElementInWarehouse(matrix)) <= max);
}

/**
 * @brief function called when the user click on the set button to set a new limit of number of items in the warehouse
 */
function set(){
    //resetting the error message to empty
    errMessage.innerHTML = "";
    
    //declaring the pattern for a generic number
    var patt = /\d+/;
    
    //if the new input limit is NaN
    if(!patt.test(setMax.value)){
        //writing the error
        errMessage.innerHTML = "Is not a number";
    } else{
        var value = parseInt(setMax.value);
        //if you try to set a limit little than the number of items in the warehouse, you will get an error
        var number = getNumberOfElementInWarehouse(matrix);
        if(value < number){
            errMessage.innerHTML = "You cannot set a limit little than the total of elements in the warehouse. Set a number larger than " + number;
        } else{
            //setting the global variable max to the new value and showing it in the html page
            max = value;
            maxNum.innerHTML = "Max: " + max;
        }
    }
}

/**
 * @brief to get the total number of items in the warehouse
 * @param [in|out] type parameter_name Parameter description.
 * @param [in|out] type parameter_name Parameter description.
 * @return Description of returned value.
 */
function getNumberOfElementInWarehouse(warehouse){
    var res = 0;
    for(i = 0; i < warehouse.length; i++) res += warehouse[i][1];
    return res;
}

/**
  * @brief it adds the input field data to the matrix.
  * @param matrix matrix.
  * @param [in|out] type parameter_name Parameter description.
  * @return Description of returned value.
*/
function addElement(matrix,sox){
    var found;
    for(i = 0; i < matrix.length; i++){
        if(matrix[i][0]==sox[0]){
            matrix[i][1] += parseInt(sox[1]);
            found = true;
        }
    }
    if(!found){
        matrix.push([sox[0],parseInt(sox[1])]);
    }
}

/**
 * @brief acquire the new ordered items from the inputs field
 * @return an array containing the two parameter of an item: [name,quantity]
 */
function acquire(){
    return [itemName.value,itemNumber.value];
}

/**
 * @brief it redraws the table in the html file with the data of the variable matrix
 * @param [matrix] the warehouse
 * @param [original] the link to the html table that shows the warehouse
 */
function drawChart(matrix,original){
    //deleting all rows for re-draw
    for(i = original.rows.length-1; i >= 0; i--){
        original.deleteRow(i);
    }
    //if the chart is empty, it will show a message
    if(matrix.length==0){
        var row = original.insertRow(0);
        cell1 = row.insertCell(0);
        cell1.innerHTML = emptyMessage;
    }
    
    //otherwise it will create the table with header and rows
    else{
        //header of the table
        var header = original.insertRow(0);
        header.style.backgroundColor = "#00FF00";
        var th1 = document.createElement("TH");
        var th2 = document.createElement("TH");
        th1.innerHTML = "Name";
        th2.innerHTML = "Number";
        header.appendChild(th1);
        header.appendChild(th2);
        
        //items with name and quantity
        var i;
        for(i = 0; i < matrix.length; i++){
            var row = original.insertRow(i+1);
            cell1 = row.insertCell(0);
            cell2 = row.insertCell(1);
            cell1.innerHTML = matrix[i][0];
            cell2.innerHTML = matrix[i][1];
        }
        
        //the last row for showing the total number of items in the chart
        var row = original.insertRow(i+1);
        row.style.backgroundColor = "#FF0000";
        cell1 = row.insertCell(0);
        cell2 = row.insertCell(1);
        cell1.innerHTML = "Totale: ";
        cell2.innerHTML = getNumberOfElementInWarehouse(matrix);
    }

}


/**
 * @brief function to check if the values inserted in the inputs field are in the right form
 * @param [sox] an array of two elements: [name,quantity] of the new order
 * @return yes if the first element of the array is an alphanumeric string not empty and the second is a number >= 1, false otherwise
 */
function validation(sox){
    //pattern for all alphanumeric string with at least one character
    var patt = /[a-zA-Z0-9]+/;
    if(!patt.test(sox[0])) return false;
    
    //pattern for generics integer numbers with at least one digit
    var patt = /\d+/;
    if(!patt.test(sox[1])) return false;
    else return (parseInt(sox[1])) > 0;
}
