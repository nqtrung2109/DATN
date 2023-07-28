document.addEventListener('DOMContentLoaded', function() {
// tạo menu ẩn hiện và chuyển tab 
let sidebar = document.querySelector(".sidebar");
let closeBtn = document.querySelector("#btn");
let searchBtn = document.querySelector(".bx-search");

closeBtn.addEventListener("click", ()=>{
    sidebar.classList.toggle("open");
    menuBtnChange();                         
});

searchBtn.addEventListener("click", ()=>{   // Sidebar mở khi clieck vào icon search 
    sidebar.classList.toggle("open");
    menuBtnChange();                   
});

// thay đổi icon của nút btn khi ẩn hiện thanh sidebar
function menuBtnChange() {
    if(sidebar.classList.contains("open")){
        closeBtn.classList.replace("bx-menu", "bx-menu-alt-right"); 
    }else {
        closeBtn.classList.replace("bx-menu-alt-right","bx-menu");  
    }
}   
});