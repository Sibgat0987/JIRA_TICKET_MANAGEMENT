var addbtn = document.querySelector(".add-btn");
var removebtn = document.querySelector(".remove-btn");
let toggleAdd = false;
var toggleClose = false;
var modal = document.querySelector(".write-cont");
var main_cont = document.querySelector(".main-cont");
var textbox = document.querySelector(".text-box");
var priority_colors = document.querySelectorAll(".priority-color");
var modalPriorityColor = "black";
var toolbox_colors = document.querySelectorAll(".color");

var allColors = [];
var allTickets = [];


if (localStorage.getItem("jira-items")) {
    allColors = JSON.parse(localStorage.getItem("jira-items"));
    allColors.forEach(color => {
        createTicket(color.ticketColor, color.ticketContent, color.ticketId);
    });
}

// On  clicking colors in toolbox get  filtered items
toolbox_colors.forEach(colorElement => {
    var color = colorElement.classList[0];
    colorElement.addEventListener("click", () => {
        var filteredColors = allColors.filter(ticketObj => ticketObj.ticketColor == color);
        allTickets.forEach(ticket => ticket.remove());
        console.log("filtered colors length : " + filteredColors.length);
        filteredColors.forEach(ticket => {
            createTicket(ticket.ticketColor, ticket.ticketContent, ticket.ticketId);
        });
    });
});

// On right click show all elements
toolbox_colors.forEach(colorElement => {
    colorElement.addEventListener("dblclick", (e) => {
        e.preventDefault();
          console.log("Right click detected!");

        allTickets.forEach(ticket => ticket.remove());
        allColors.forEach(ticket => {
            createTicket(ticket.ticketColor, ticket.ticketContent, ticket.ticketId);
        });
    });
});

var colors = ["lightpink", "lightblue", "lightgreen", "black"];

removebtn.addEventListener("click", () => {
    toggleClose = !toggleClose;
});

var lock = "fa-lock";
var unlock = "fa-lock-open";

priority_colors.forEach(element => {
    element.addEventListener("click", () => {
        priority_colors.forEach(color => color.classList.remove("border"));
        modalPriorityColor = element.classList[0];
        console.log("modalPriorityColor : " + modalPriorityColor);
        element.classList.add("border");
    });
});

// Showing a modal on clicking add button
addbtn.addEventListener("click", () => {
    console.log("clicked");
    modal.style.display = toggleAdd ? "none" : "flex";
    toggleAdd = !toggleAdd;
});

// Closing a modal on pressing shift button
modal.addEventListener("keydown", (e) => {
    console.log(e.key);
    if (e.key == "Shift") {
        console.log("shift");
        createTicket(modalPriorityColor, textbox.value);
        toggleAdd = false;
        setModalToDefault();
    }
});

// Function to create a ticket
function createTicket(ticketColor, ticketContent, id) {
    console.log("id is : " + id);
    var ticketId = id || shortid();
    var ticket = document.createElement('div');
    ticket.setAttribute("class", "ticket-cont");
    ticket.innerHTML = `
        <div class="ticket-color ${ticketColor}"></div>
        <div class="ticket-id">#${ticketId}</div>
        <div class="task-content">${ticketContent}</div>
        <div class="ticket-lock">
            <i class="fa fa-lock" aria-hidden="true"></i>
        </div>
    `;
    main_cont.appendChild(ticket);

    if (!id) {
        allColors.push({ ticketColor, ticketContent, ticketId });
        localStorage.setItem("jira-items", JSON.stringify(allColors));
    }

    allTickets.push(ticket);
    addingListener(ticket, ticketId);
    handleTicketLock(ticket, ticketId);
    handleTicketColor(ticket, ticketId);
}

function getTicketIdx(id) {
    return allColors.findIndex(ticket => ticket.ticketId === id);
}

function addingListener(ticket, ticketId) {
    ticket.addEventListener("click", () => {
        if (toggleClose) {
            ticket.remove();
            var index = getTicketIdx(ticketId);
            allColors.splice(index, 1);
            localStorage.setItem("jira-items", JSON.stringify(allColors));
        }
    });
}

function handleTicketLock(ticket, ticketId) {
    var ticketLockElement = ticket.querySelector(".ticket-lock");
    var ticketLock = ticketLockElement.children[0];
    var ticketText = ticket.querySelector(".task-content");
    ticketLock.addEventListener("click", () => {
        if (ticketLock.classList.contains(lock)) {
            ticketLock.classList.remove(lock);
            ticketLock.classList.add(unlock);
            ticketText.setAttribute("contenteditable", "true");
        } else {
            ticketLock.classList.add(lock);
            ticketLock.classList.remove(unlock);
            ticketText.setAttribute("contenteditable", "false");
            var index = getTicketIdx(ticketId);
            allColors[index].ticketContent = ticketText.innerText;
            localStorage.setItem("jira-items", JSON.stringify(allColors));
        }
    });
}
//click one tthe color bar once ur task is doe change its priority color now
function handleTicketColor(ticket, ticketId) {
    var ticketColor = ticket.querySelector(".ticket-color");
    ticketColor.addEventListener("click", () => {
        var currentColor = ticketColor.classList[1];
        var currentColorIdx = colors.findIndex(color => color === currentColor);
        var nextColorIdx = (currentColorIdx + 1) % colors.length;
        var nextColor = colors[nextColorIdx];
        ticketColor.classList.remove(currentColor);
        ticketColor.classList.add(nextColor);
        var index = getTicketIdx(ticketId);
        allColors[index].ticketColor = nextColor;
        localStorage.setItem("jira-items", JSON.stringify(allColors));
    });
}

function setModalToDefault() {
    modalPriorityColor = colors[colors.length - 1];
    textbox.value = "";
    modal.style.display = "none";
    priority_colors.forEach(color => {
        color.classList.remove("border");
        if (color.classList.contains("black")) {
            color.classList.add("border");
        }
    });
}

// Ensure modal is hidden on page load
window.addEventListener("load", () => {
    modal.style.display = "none";
});