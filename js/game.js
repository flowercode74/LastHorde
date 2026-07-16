// =========================
// Elements
// =========================

const viewport = document.getElementById("viewport");

const world = document.getElementById("world");
const map = document.getElementById("map");

const inventoryOverlay =
document.getElementById("inventory-overlay");

const closeInventory =
document.getElementById("close-inventory"); 

const inventoryButton =
document.getElementById("inventory-btn");

const villageView =
document.getElementById("village-view");

const worldMapView =
document.getElementById("world-map-view");

const worldGrid =
document.getElementById("world-grid");

const mapButton =
document.getElementById("map-button");

const villageButton =
document.getElementById("village-button");

const messagesButton =
document.getElementById("messages-button");


const messagesView =
document.getElementById("messages-view");

const backButton =
document.getElementById("back-village");

const itemPopup =
document.getElementById("item-popup");

const itemPopupTitle =
document.getElementById("item-popup-title");

const itemPopupIcon =
document.getElementById("item-popup-icon");

const itemPopupInfo =
document.getElementById("item-popup-info");

const closeItemPopup =
document.getElementById("close-item-popup");

const minusItem =
document.getElementById("minus-item");

const plusItem =
document.getElementById("plus-item");

const selectedAmount =
document.getElementById("selected-amount");

const itemTotalReward =
document.getElementById("item-total-reward");

const armyTab =
document.getElementById("army-tab");

const armyPanel =
document.getElementById("army-panel");

const closeArmy =
document.getElementById("close-army");

const troopBtn = document.getElementById("troopsButton");

const troopOverlay = document.getElementById("troop-overlay");

const closeTroopPopup = document.getElementById("closeTroopPopup");

// =========================
// Camera
// =========================

let scale = 0.5;

let posX = 300;
let posY = 200;

let dragging = false;

let startX = 0;
let startY = 0;

let pinchStartDistance = 0;
let pinchStartScale = 1;

let selectedItem = null;
let useAmount = 1;
let currentView = "village";


// =========================
// Helpers
// =========================

function inventoryIsOpen(){

    return inventoryOverlay.style.display === "flex";

}

function activeElement(){

    return worldMapView.style.display === "block"
        ? worldGrid
        : world;
}

function activeWidth(){

    if(worldMapView.style.display === "block"){

        return worldGrid.offsetWidth;

    }

    return map.offsetWidth;
}

function activeHeight(){

    if(worldMapView.style.display === "block"){

        return worldGrid.offsetHeight;

    }

    return map.offsetHeight;
}

function getDistance(t1,t2){

    const dx = t2.clientX - t1.clientX;
    const dy = t2.clientY - t1.clientY;

    return Math.sqrt(dx*dx + dy*dy);
}

function updateItemReward(){

    if(!selectedItem) return;

    selectedAmount.innerText =
    useAmount;

    itemTotalReward.innerText =
    `دریافت: ${
        useAmount *
        selectedItem.rewardValue
    }`;
}

function changeView(from,to){

    from.classList.add("game-transition-out");


    setTimeout(()=>{


        from.style.display="none";


        from.classList.remove("game-transition-out");


        to.style.display="block";


        to.classList.add("game-transition-in");


        setTimeout(()=>{

            to.classList.remove("game-transition-in");

        },350);


    },250);

}

function closeAllWindows(){

    inventoryOverlay.style.display = "none";

    troopOverlay.style.display = "none";

    messagesView.style.display = "none";

    itemPopup.style.display = "none";

}

// =========================
// Clamp
// =========================

function clampPosition(){

    const contentWidth =
        activeWidth() * scale;

    const contentHeight =
        activeHeight() * scale;

    const viewportWidth =
        viewport.clientWidth;

    const viewportHeight =
        viewport.clientHeight;


    // اگر محتوا از صفحه کوچکتر شد، وسط قرار بگیرد
    if(contentWidth <= viewportWidth){

        posX = (viewportWidth - contentWidth) / 2;

    }else{

        const minX = viewportWidth - contentWidth;

        posX = Math.max(
            minX,
            Math.min(0, posX)
        );

    }


    if(contentHeight <= viewportHeight){

        posY = (viewportHeight - contentHeight) / 2;

    }else{

        const minY = viewportHeight - contentHeight;

        posY = Math.max(
            minY,
            Math.min(0, posY)
        );

    }

}

// =========================
// Render
// =========================

function update(){

    clampPosition();

    activeElement().style.transform =
    `translate(${posX}px,${posY}px) scale(${scale})`;
}


// =========================
// Center
// =========================

function centerCurrentView(){

    const width =
        activeWidth() * scale;

    const height =
        activeHeight() * scale;

    posX =
        (viewport.clientWidth - width)/2;

    posY =
        (viewport.clientHeight - height)/2;

    update();
}

function goToVillage(callback){

    if(currentView !== "village"){

        let currentScreen;

        if(currentView === "map"){
            currentScreen = worldMapView;
        }

        if(currentView === "messages"){
            currentScreen = messagesView;
        }


        changeView(
            currentScreen,
            villageView
        );


        currentView = "village";


        setTimeout(()=>{

            centerCurrentView();

            if(callback){
                callback();
            }

        },300);


    }else{

        if(callback){
            callback();
        }

    }

}

// =========================
// Mouse Drag
// =========================

viewport.addEventListener("mousedown",(e)=>{

    if(currentView !== "village" && currentView !== "map") return;

    if(inventoryIsOpen()) return;

    dragging = true;

    startX = e.clientX - posX;
    startY = e.clientY - posY;

});

window.addEventListener("mousemove",(e)=>{

    if(currentView !== "village" && currentView !== "map") return;

     if(inventoryIsOpen()) return;

    if(!dragging) return;

    posX = e.clientX - startX;
    posY = e.clientY - startY;

    update();

});

window.addEventListener("mouseup",()=>{

    dragging = false;

});


// =========================
// Mouse Zoom
// =========================

viewport.addEventListener("wheel",(e)=>{

    if(inventoryIsOpen()) return;
    e.preventDefault();

    const rect =
        viewport.getBoundingClientRect();

    const mouseX =
        e.clientX - rect.left;

    const mouseY =
        e.clientY - rect.top;

    const oldScale = scale;

    if(e.deltaY < 0){

        scale *= 1.15;

    }else{

        scale /= 1.15;
    }

    scale =
        Math.max(0.4,
        Math.min(4,scale));

    const ratio =
        scale / oldScale;

    posX =
        mouseX -
        (mouseX - posX) * ratio;

    posY =
        mouseY -
        (mouseY - posY) * ratio;

    update();

},{passive:false});


// =========================
// Touch
// =========================

viewport.addEventListener("touchstart",(e)=>{

     if(inventoryIsOpen()) return;

    e.preventDefault();

    if(e.touches.length === 1){

        dragging = true;

        startX =
        e.touches[0].clientX - posX;

        startY =
        e.touches[0].clientY - posY;
    }

    if(e.touches.length === 2){

        dragging = false;

        pinchStartDistance =
        getDistance(
            e.touches[0],
            e.touches[1]
        );

        pinchStartScale = scale;
    }

},{passive:false});


viewport.addEventListener("touchmove",(e)=>{

    if(inventoryIsOpen()) return;

    e.preventDefault();

    if(e.touches.length === 1 && dragging){

        posX =
        e.touches[0].clientX - startX;

        posY =
        e.touches[0].clientY - startY;

        update();
    }

    if(e.touches.length === 2){

        const newDistance =
        getDistance(
            e.touches[0],
            e.touches[1]
        );

        scale =
        pinchStartScale *
        (newDistance /
        pinchStartDistance);

        const MIN_SCALE = 0.5;
        const MAX_SCALE = 2.5;

        scale = Math.max(
        MIN_SCALE,
        Math.min(MAX_SCALE, scale)
        );

        update();
    }

},{passive:false});


viewport.addEventListener("touchend",()=>{

    dragging = false;

});


// =========================
// World Map Generation
// =========================

const MAP_WIDTH = 80;
const MAP_HEIGHT = 80;

const mapData = [];

for(let y=0;y<MAP_HEIGHT;y++){

    const row = [];

    for(let x=0;x<MAP_WIDTH;x++){

        const r = Math.random();

        if(r < 0.10){

            row.push(2);

        }else if(r < 0.15){

            row.push(3);

        }else if(r < 0.20){

            row.push(4);

        }else{

            row.push(1);
        }
    }

    mapData.push(row);
}


mapData.forEach(row=>{

    row.forEach(tile=>{

        const div =
        document.createElement("div");

        div.classList.add("tile");

        if(tile === 1)
            div.classList.add("grass");

        if(tile === 2)
            div.classList.add("forest");

        if(tile === 3)
            div.classList.add("mountain");

        if(tile === 4)
            div.classList.add("water");

        worldGrid.appendChild(div);

    });

});

const inventory = [

    {
        id:1,
        name:"بسته ماهی",
        icon:"🐟",
        amount:10,
        rewardType:"fish",
        rewardValue:1000
    },

    {
        id:2,
        name:"بسته چوب",
        icon:"🧱",
        amount:5,
        rewardType:"wood",
        rewardValue:1000
    },

    {
        id:3,
        name:"بسته سنگ",
        icon:"🥔",
        amount:8,
        rewardType:"stone",
        rewardValue:1000
    }

];

// =========================
// Buttons
// =========================

mapButton.addEventListener("click",()=>{

    if(currentView === "map"){
        return;
    }

    changeView(
        villageView,
        worldMapView
    );

    currentView = "map";

});


villageButton.addEventListener("click",()=>{

    if(currentView === "village"){
        return;
    }


    let currentScreen;


    if(currentView === "map"){

        currentScreen = worldMapView;

    }


    if(currentView === "messages"){

        currentScreen = messagesView;

    }


    changeView(
        currentScreen,
        villageView
    );

    scale = 0.5;

    posX = 300;

    posY = 200;

    update();
    
    currentView="village";


    setTimeout(()=>{

        centerCurrentView();

    },300);


});

messagesButton.addEventListener("click",()=>{


    if(currentView === "messages"){
        return;
    }


    let currentScreen;


    if(currentView === "village"){

        currentScreen = villageView;

    }


    if(currentView === "map"){

        currentScreen = worldMapView;

    }


    closeAllWindows();
    changeView(
        currentScreen,
        messagesView
    );


    currentView="messages";


});


backButton.addEventListener("click",()=>{

    worldMapView.style.display = "none";

    villageView.style.display = "block";

    currentView = "village";

});

inventoryButton.addEventListener("click",()=>{

    goToVillage(()=>{

        closeAllWindows();

        renderInventory();

        inventoryOverlay.style.display="flex";
        dragging = false;
    });

});

closeInventory.addEventListener("click",()=>{

    inventoryOverlay.style.display = "none";

}); 

armyTab.addEventListener("click",()=>{

    armyPanel.classList.toggle("open");

});

troopBtn.addEventListener("click",()=>{

    goToVillage(()=>{

        closeAllWindows();

        troopOverlay.style.display="flex";

    });

});


function closeTroopWindow(){

    troopOverlay.style.display="none";

}


closeTroopPopup.addEventListener("click",closeTroopWindow);

closeTroopPopup.addEventListener("touchend",(e)=>{

    e.preventDefault();

    closeTroopWindow();

});

// =========================
// Tooltip
// =========================

let tooltip;

document
.querySelectorAll("[data-tooltip]")
.forEach(btn=>{

    let timer;

    function showTooltip(){

        tooltip =
        document.createElement("div");

        tooltip.className =
        "tooltip";

        tooltip.innerText =
        btn.dataset.tooltip;

        document.body.appendChild(
            tooltip
        );

        const rect =
        btn.getBoundingClientRect();

        tooltip.style.left =
        rect.left +
        rect.width/2 + "px";

        tooltip.style.top =
        rect.top - 50 + "px";

        setTimeout(()=>{

            tooltip.classList.add(
                "show"
            );

        },10);
    }

    function hideTooltip(){

        clearTimeout(timer);

        if(tooltip){

            tooltip.remove();

            tooltip = null;
        }
    }

    btn.addEventListener(
        "mouseenter",
        showTooltip
    );

    btn.addEventListener(
        "mouseleave",
        hideTooltip
    );

    btn.addEventListener(
        "touchstart",
        ()=>{

            timer =
            setTimeout(
                showTooltip,
                500
            );

        }
    );

    btn.addEventListener(
        "touchend",
        hideTooltip
    );
});


// =========================
// Start
// =========================
map.addEventListener("dragstart",(e)=>{

    e.preventDefault();

});

document
.querySelectorAll(".building")
.forEach(building=>{

    building.addEventListener(
        "dragstart",
        e=>e.preventDefault()
    );

});

window.addEventListener("resize",()=>{

    centerCurrentView();

});

window.addEventListener("load",()=>{

    centerCurrentView();

});

function renderInventory(){

    const grid =
    document.getElementById("inventory-grid");

    grid.innerHTML = "";

    inventory.forEach(item=>{

        const slot =
        document.createElement("div");

        slot.className =
        "item-slot";

        slot.innerHTML = `

            <div class="item-icon">
                ${item.icon}
            </div>

            <div class="item-name">
                ${item.name}
            </div>

            <div class="item-count">
                x${item.amount}
            </div>

        `;

        grid.appendChild(slot);
        

        slot.addEventListener("click",()=>{

            selectedItem = item;

            useAmount = 1;

            itemPopupTitle.innerText =
            item.name;

            itemPopupIcon.innerText =
            item.icon;

            itemPopupInfo.innerHTML = `
                تعداد: ${item.amount}<br>
                هر عدد: ${item.rewardValue}
            `;

            updateItemReward();

            itemPopup.style.display =
            "flex";

        });

    });

}

closeItemPopup.addEventListener("click",()=>{

    itemPopup.style.display =
    "none";

});

plusItem.addEventListener("click",()=>{

    if(!selectedItem) return;

    if(useAmount <
       selectedItem.amount){

        useAmount++;

        updateItemReward();
    }

});

minusItem.addEventListener("click",()=>{

    if(useAmount > 1){

        useAmount--;

        updateItemReward();
    }

});

// =========================
// Message Tabs
// =========================

const messageTabs =
document.querySelectorAll(".message-tab");


messageTabs.forEach(tab=>{


    function selectTab(e){

        if(e){
            e.preventDefault();
        }


        messageTabs.forEach(t=>{

            t.classList.remove("active");

        });


        tab.classList.add("active");


    }


    tab.addEventListener(
        "click",
        selectTab
    );


    tab.addEventListener(
        "touchend",
        selectTab,
        {passive:false}
    );


});