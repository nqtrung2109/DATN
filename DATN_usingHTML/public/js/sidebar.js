document.addEventListener('DOMContentLoaded', function() {
// tạo menu ẩn hiện và chuyển tab 
let sidebar = document.querySelector(".sidebar");
let closeBtn = document.querySelector("#btn");
let searchBtn = document.querySelector(".bx-search");

closeBtn.addEventListener("click", ()=>{
    sidebar.classList.toggle("open");
    menuBtnChange();                         //calling the function(optional)
});

searchBtn.addEventListener("click", ()=>{   // Sidebar open when you click on the search iocn
    sidebar.classList.toggle("open");
    menuBtnChange();                        //calling the function(optional)
});

// thay đổi icon của nút btn khi ẩn hiện thanh sidebar
function menuBtnChange() {
    if(sidebar.classList.contains("open")){
        closeBtn.classList.replace("bx-menu", "bx-menu-alt-right"); //replacing the iocns class
    }else {
        closeBtn.classList.replace("bx-menu-alt-right","bx-menu");  //replacing the iocns class
    }
}   
});