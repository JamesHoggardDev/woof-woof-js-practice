const dogBar = document.querySelector("#dog-bar")
const mainDogDiv = document.querySelector("#dog-info")
const filterBttn = document.querySelector("#good-dog-filter")

function uponLoad(){
    fetch('http://localhost:3000/pups')
    .then(res => res.json())
    .then(dogArr => {
        dogArr.forEach(dogObj => showOneCard(dogObj))
    })
}

function showOneCard(dogObj){
    const dogSpan = document.createElement('span')
        dogSpan.dataset.id = dogObj.id
        dogSpan.textContent = dogObj.name
        dogSpan.addEventListener('click', evt => {
            makeCenterDiv(dogObj)
        })    
        dogBar.append(dogSpan)
}

function makeCenterDiv(dogObj){
    mainDogDiv.innerHTML = ""

    const detImg = document.createElement('img')
        detImg.src = dogObj.image

    const detH2 = document.createElement('h2')
        detH2.textContent = dogObj.name

    const detBttn = document.createElement('button')
        detBttn.classList.add('center-button')
        detBttn.textContent = dogObj.isGoodDog ? "Good Dog!" : "Bad Dog!"
        detBttn.addEventListener('click', evt => {
            toggleText(dogObj)
        })

        mainDogDiv.append(detImg, detH2, detBttn);
}

function toggleText(dogObj){
    let detBttn = document.querySelector('.center-button')

    if(dogObj.isGoodDog === true){
        detBttn.textContent = "Bad Dog!"
        newValue = false;
    } else {
        detBttn.textContent = "Good Dog!"
        newValue = true;
    }

    fetch(`http://localhost:3000/pups/${dogObj.id}`, {
        method: "PATCH",
        headers: {
            "content-type" : "application/json",
            "accept": "application/json"
        },
        body: JSON.stringify({
            isGoodDog: newValue})
    })
    .then(res => res.json())
    .then(makeCenterDiv)
}

filterBttn.addEventListener('click', evt => {
    if(evt.target.textContent.includes('ON')){
        evt.target.textContent = `Filter good dogs: OFF`
        dogBar.innerHTML = '';
        uponLoad();
    } else { //if OFF
        evt.target.textContent = `Filter good dogs: ON`
        fetch('http://localhost:3000/pups')
            .then(res => res.json())
            .then(dogArr => {
                let goodDogsArr = dogArr.filter(dogObj => dogObj.isGoodDog === true);
                    dogBar.innerHTML = '';
                    goodDogsArr.forEach(dogObj => showOneCard(dogObj))
            })
    }
})
uponLoad();