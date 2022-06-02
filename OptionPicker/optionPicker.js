function addOption(){
    let optionBox = document.querySelector("#optionBox");
    if(optionBox.value.length>0){
        let option = document.createElement("li");
        option.textContent = optionBox.value;
        document.querySelector("#optionsList").appendChild(option);
        optionBox.value = "";
    }
}
function chooseRandom(){
    let optionsList = document.querySelector("#optionsList");
    if(optionsList.childElementCount>0){
        let picker = Math.floor(Math.random() * document.querySelector("#optionsList").childElementCount);
        document.querySelector("#results").textContent = document.querySelector("#optionsList").children[picker].textContent;
    }

}
function clearList(){
    document.querySelector("#optionsList").innerHTML = '';
    document.querySelector("#results").textContent = '';
}
document.querySelector("#submitButton").addEventListener("click", addOption);
document.addEventListener("keydown",(event) => {
    if(event.code == "Enter"){
        addOption();
    }
})

