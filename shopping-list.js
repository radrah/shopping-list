const shoppingForm = document.querySelector('.shopping');
const shoppingList = document.querySelector('.list');

// Holds the state of the application in an array - (the items we input)
let items = [];

function handleSubmit(event) {
    event.preventDefault();
    const name = event.target.item.value.trim();
    if(!name) return alert('noname');

    const item ={
        name: name,
        id: Date.now(),
        complete: false,      
    };

    items.push(item);
    
    event.target.reset();
    
    //  fire off a custom event to tell others that the items have been updated
    shoppingList.dispatchEvent(new CustomEvent('itemsUpdated'));
}

function displayItems() {
    const html = items
    .map(
        item => `<li class="shopping-item">
        <input 
        type="checkbox" 
        value="${item.id}"
        ${item.complete && 'checked'}
        ">
        <span class="itemName">${item.name}</span>
        <button 
        aria-label="Remove ${item.name}"
        value="${item.id}"
        >&times;</>
    </li>`).join('');
    shoppingList.innerHTML = html;
}

function deleteItem(id) {
    // items.forEach(itemO => {
    //     if(itemO.id == id){
    //     let itemIndex = items.indexOf(itemO);
    //     items.splice(itemIndex, 1);
    // }});

    items = items.filter(item => item.id !== id);
 
    shoppingList.dispatchEvent(new CustomEvent('itemsUpdated'));
}

function markAsComplete(id){
    const itemRef = items.find(item => item.id === id);
    itemRef.complete = !itemRef.complete;

    shoppingList.dispatchEvent(new CustomEvent('itemsUpdated'));
}

function mirrorToLocalStorage() {
    localStorage.setItem('items', JSON.stringify(items));
    
}

function restoreFromLocalStorage() {
    const lsItems = JSON.parse(localStorage.getItem('items'));
    console.log(lsItems);
    if(lsItems.length){
      items.push(...lsItems);  
      shoppingList.dispatchEvent(new CustomEvent('itemsUpdated'));
    }
}

shoppingForm.addEventListener('submit', handleSubmit);
shoppingList.addEventListener('itemsUpdated', displayItems);

shoppingList.addEventListener('itemsUpdated', mirrorToLocalStorage);

//Listens to the list for click but only works if clicked on a button
shoppingList.addEventListener('click', function(event){
    if(event.target.matches('button')){
        deleteItem(parseInt(event.target.value));
    }
    if(event.target.matches('input[type="checkbox"]')){
        markAsComplete(parseInt(event.target.value));
    }
});


restoreFromLocalStorage();