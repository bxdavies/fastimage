/*
    Event Handlers
*/

// Page Load
window.addEventListener("load", function()
{
    var send = {product: product};
    $.getJSON('/api/product/types', send, function(result)
    {
        for (i in result)
        {
            var myPargraph = document.createElement("p")

            var myInput = document.createElement("input")
            var myLabel = document.createElement("label")
 
            myInput.setAttribute("type", "radio");
            myInput.setAttribute("value", result[i]);
            myInput.setAttribute("name", "productType")

            myLabel.setAttribute("for", result[i]);
            myLabel.innerHTML = result[i];

            myPargraph.appendChild(myInput);
            myPargraph.appendChild(myLabel);

            document.getElementById("productType").prepend(myPargraph)
        }
    });
});

// Product Type Form Submit
document.getElementById("productTypeSubmitButton").addEventListener("click", function()
{
    var productType = document.querySelector('input[name="productType"]:checked').value;

    var send = {product: product, type: productType};
    $.getJSON('/api/product/bases', send, function(result)
    {
       
        for (i in result)
        {
            var myPargraph = document.createElement("p");


            var myInput = document.createElement("input");
            var myLabel = document.createElement("label");
 
            myInput.setAttribute("type", "checkbox");
            myInput.setAttribute("id", `${result[i]}Check`);
            myInput.setAttribute("value", result[i]);
            myInput.setAttribute("onclick", "productColourChecked(this.value)")
            myLabel.setAttribute("for", result[i]);
            myLabel.innerHTML = result[i];

            myPargraph.appendChild(myInput);
            myPargraph.appendChild(myLabel);

            document.getElementById("productColours").appendChild(myPargraph)

        };
    });
});

// Move Image Up Button Press
document.getElementById("moveImageUp").addEventListener("click", function() 
{
    moveup()
});

// Move Image Down Button Press
document.getElementById("moveImageDown").addEventListener("click", function() 
{
    movedown()
});

// Move Image Left Button Press
document.getElementById("moveImageLeft").addEventListener("click", function() 
{
    moveLeft()
});

// Move Image Right Button Press
document.getElementById("moveImageRight").addEventListener("click", function() 
{
    moveright()
});

// Image Size Changed
document.getElementById("imageSize").addEventListener('change', function (evt) 
{

    var images = document.querySelectorAll(".overlayImage");
    for (i = 0; i < images.length; i++)
    {
        images[i].style.width = this.value + "%";
    }
});

// Save Images Button Press
document.getElementById("saveImages").addEventListener("click", function() 
{
    var div = document.getElementById('products');
    var divs = div.getElementsByTagName('div');

    $(divs).each(function (i)
    {
        var baseImage = divs[i].id.replace("Product", "")
        saveImage(divs[i], baseImage)
                
    });
});

// Save DOM as PNG
function saveImage(idToSave, baseImage)
{
    domtoimage.toBlob(idToSave).then(function (blob) 
    {
        window.saveAs(blob, `${workingImage}-${product}-${baseImage}.png`);
    });
}
/* 
    Functions
*/
function productColourChecked(baseImage)
{
    var myCheckbox = document.getElementById(`${baseImage}Check`);
    if (myCheckbox.checked == true)
    {
        var productType = document.querySelector('input[name="productType"]:checked').value;
        var myDiv = document.createElement('DIV')
        myDiv.setAttribute("id", `${baseImage}Product`)
        myDiv.setAttribute("class", "imageWrapper")
        document.getElementById("products").appendChild(myDiv)
        var filename = `/static/products/${product}/${productType}/${baseImage}.jpg`;
        var filenameT = `/static/uploads/${workingImage}.png`;
        var myImage = document.createElement("IMG");
        var myImageT = document.createElement("IMG")
        myImage.setAttribute("src", filename);
        myImage.setAttribute("class", "baseImage")
        myImageT.setAttribute("src", filenameT)
        myImageT.setAttribute("class", "overlayImage")
        myImageT.style.width = "50%";
        myDiv.appendChild(myImage);
        myDiv.appendChild(myImageT)
    }
    else
    {
        document.getElementById(`${baseImage}Product`).remove();
    }

};

function moveup() {
    var images = document.querySelectorAll(".overlayImage");
    for (i = 0; i < images.length; i++)
    {
        style = window.getComputedStyle(images[i])
        imageLocation = style.getPropertyValue('top');
        newLocation =  parseInt( imageLocation, 10 ) - parseInt( 10, 10 ) + "px";
        images[i].style.top = newLocation;
    }
};
  
function movedown() {
    var images = document.querySelectorAll(".overlayImage");
    for (i = 0; i < images.length; i++)
    {
        style = window.getComputedStyle(images[i])
        imageLocation = style.getPropertyValue('top');
        newLocation =  parseInt( imageLocation, 10 ) + parseInt( 10, 10 ) + "px";
        images[i].style.top = newLocation;
    }
};
  
function moveright() {
    var images = document.querySelectorAll(".overlayImage");
    for (i = 0; i < images.length; i++)
    {
        style = window.getComputedStyle(images[i])
        imageLocation = style.getPropertyValue('left');
        newLocation =  parseInt( imageLocation, 10 ) + parseInt( 10, 10 ) + "px";
        images[i].style.left = newLocation;
    }
};

function moveLeft() {
    var images = document.querySelectorAll(".overlayImage");
    for (i = 0; i < images.length; i++)
    {
        style = window.getComputedStyle(images[i])
        imageLocation = style.getPropertyValue('left');
        newLocation =  parseInt( imageLocation, 10 ) - parseInt( 10, 10 ) + "px";
        images[i].style.left = newLocation;
    }
};