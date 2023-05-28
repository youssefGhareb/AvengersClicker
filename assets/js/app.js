const model = {
    avengers: [
        {
            id: 1,
            name: "Spider-man",
            url: "assets/img/spider-man.jpg",
            count: 0
        },
        {
            id: 2,
            name: "Captain America",
            url: "assets/img/captain-america.jpg",
            count: 0
        },
        {
            id: 3,
            name: "Iron-Man",
            url: "assets/img/iron-man.jpg",
            count: 0
        },
        {
            id: 4,
            name: "Hulk",
            url: "assets/img/hulk.jpg",
            count: 0
        },
        {
            id: 5,
            name: "Dr. Strange",
            url: "assets/img/drStrange.jpg",
            count: 0
        },
        {
            id: 6,
            name: "Thor",
            url: "assets/img/thor.webp",
            count: 0
        },
    ],
    currentSelectedAvengerID: null,
    getAvengers: function () {
        return this.avengers;
    },
    setCurrentSelectedAvengerID: function (id) {
        this.currentSelectedAvengerID = id;
    },
    getCurrentSelectedAvenger: function () {
        let currentSelectedAvenger = this.avengers.find((avenger) => {
            return avenger.id === this.currentSelectedAvengerID;
        });
        return currentSelectedAvenger;
    },
    incrementCurrentAvenger: function () {
        this.avengers.map((avenger) => {
            if (avenger.id === this.currentSelectedAvengerID) {
                avenger.count++;
            }
            return avenger;
        })
    },
    updateCurrentAvenger: function(newAvenger){
        this.avengers.map((avenger)=>{
            if(avenger.id === this.currentSelectedAvengerID){
                avenger.name = newAvenger.name;
                avenger.count = newAvenger.count;
                avenger.url = newAvenger.url;
            }
            return avenger;
        })
    }
}

const appController = {
    init: function(){
        model.setCurrentSelectedAvengerID(model.avengers[0].id);
        avengersListView.init();
        selectedAvengerView.init();
        adminView.init();
    },
    getAvengers: function(){
        return model.getAvengers();
    },
    getSelectedAvenger: function(){
        return model.getCurrentSelectedAvenger();
    },
    listItemClick: function (id) {
        model.setCurrentSelectedAvengerID(id);
        selectedAvengerView.updateAvenger(this.getSelectedAvenger());
        this.updateAdmin();
    },
    currentAvengerClick: function(){
        model.incrementCurrentAvenger();
        selectedAvengerView.updateAvenger(this.getSelectedAvenger());
        this.updateAdmin();
    },
    updateAdmin: function(){
        adminView.currentAvenger = appController.getSelectedAvenger();
        adminView.render();
    },
    adminToggleClick: function(){
        adminView.isOpen = !adminView.isOpen;
        appController.updateAdmin();
    },
    adminSaveClick: function(){
        model.updateCurrentAvenger({
            id: null,
            name: adminView.nameInputElement.val(),
            count: adminView.countInputElement.val(),
            url: adminView.urlInputElement.val()
        }),
        avengersListView.reRender();
        selectedAvengerView.updateAvenger(appController.getSelectedAvenger());
    },
    adminCloseClick: function(){
        adminView.isOpen = false;
        adminView.render();
    }
}

const adminView = {
    isOpen: null,
    currentAvenger: {},
    parentElem: null,
    nameInputElement: null,
    countInputElement: null,
    urlInputElement: null,
    saveBtnElement: null,
    closeBtnElement: null,
    toggleBtnELement: null,

    init: function(){
        this.isOpen = false,
        this.currentAvenger = appController.getSelectedAvenger();
        this.parentElem = $("#admin-wrapper");
        this.nameInputElement = $("#nameInput");
        this.countInputElement = $("#countInput");
        this.urlInputElement = $("#urlInput");
        this.toggleBtnELement = $("#toggleBtn");
        this.closeBtnElement = $("#closeBtn");
        this.saveBtnElement = $("#saveBtn");

        this.bindEvents();
    },

    render: function(){
        if(this.isOpen){
            this.parentElem.slideDown();
            this.nameInputElement.val(this.currentAvenger.name);
            this.countInputElement.val(this.currentAvenger.count);
            this.urlInputElement.val(this.currentAvenger.url);
        } else{
            this.parentElem.slideUp();
            this.nameInputElement.val('');
            this.countInputElement.val('');
            this.urlInputElement.val('');
        }
    },

    bindEvents: function(){
        this.toggleBtnELement.click(appController.adminToggleClick);
        this.saveBtnElement.click(appController.adminSaveClick);
        this.closeBtnElement.click(appController.adminCloseClick);
    }
}

const avengersListView = {
    avengers: [],
    avengersListElem: {},
    init: function () {
        this.avengers = appController.getAvengers();
        this.avengersListElem = $(".avengers-list");
        this.render();
    },
    reRender: function(){
        this.avengers = appController.getAvengers();
        this.render();
    },
    render: function () {
        this.avengersListElem.html('');
        for (let i = 0; i < this.avengers.length; i++) {
            this.avengersListElem.append(
                `
                    <li class="avengers-list-item">
                        <div class="avengers-list-item-imgCont">
                            <img src="${this.avengers[i].url}" onclick=appController.listItemClick(${this.avengers[i].id}) class="img-fluid" alt="${this.avengers[i].name}">
                        </div>
                    </li>
                `
            );
        }
    }
}

const selectedAvengerView = {
    avenger: {},
    parentElement: {},
    init: function () {
        this.avenger = appController.getSelectedAvenger();
        this.parentElement = $("#selected-avenger-wrapper");
        this.render();
    },
    render: function(){
        this.parentElement.html('');
        this.parentElement.append(
            `
                    <div class="selected-avenger">
                        <div class="selected-avenger-imgCont"  onclick=appController.currentAvengerClick()>
                            <img src="${this.avenger.url}" class="img-fluid">
                        </div>
                        <h1 class="selected-avenger-name">
                            ${this.avenger.name}
                        </h1>
                        <div class="selected-avenger-count">
                            Count : <span class="selected-avenger-count-value">${this.avenger.count}</span>
                        </div>
                    </div>
            `
        )
    },
    updateAvenger: function(avenger){
        this.avenger = avenger;
        this.render();
    }
}

$(document).ready(function () {
    appController.init();
});