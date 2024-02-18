//navbar

const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if(scrollY >= 270){
        navbar.classList.add('bg');
    }
    else{
        navbar.classList.remove('bg');
    }
})


const createNavbar = () => {
    let navbar = document.querySelector('.navbar');
    navbar.innerHTML += `
    <ul class="links-container">
    <li class="link-item"><a href="#" class="link active">home</a></li>
    <li class="link-item"><a href="#" class="link">product</a></li>
    <li class="link-item"><a href="#" class="link">about</a></li>
    <li class="link-item"><a href="#" class="link">contact</a></li>
</ul>
<div class="user-interactions">
    <div class="cart">
        <img src="img/cart.png" class="cart-icon" alt="">
        <span class="cart-item-count">0</span>
    </div>
    <div class="user">
        <img src="img/user.png" class="user-icon" alt="">
        <div class="user-icon-popup">
            <p>log in to your account</p>
            <a>login</a>
        </div>
    </div>
</div>
`
}

createNavbar();

//user icon popup

let userIcon = document.querySelector('.user-icon');
let userPopupIcon = document.querySelector('.user-icon-popup');

userIcon.addEventListener('click', () => userPopupIcon.classList.toggle('active'));

let text = userPopupIcon.querySelector('p');
let actionBtn = userPopupIcon.querySelector('a');
let user = JSON.parse(sessionStorage.user || null);

if( user != null){ // user is logged in
    text.innerHTML = `log in as, ${user.name}`;
    actionBtn.innerHTML = 'logout';
    actionBtn.addEventListener('click', () => logout());
}else{
    text.innerHTML = 'log in to your account';
    actionBtn.innerHTML = 'login';
    actionBtn.addEventListener('click', () => location.href = '/login');
}

const logout = () => {
    sessionStorage.clear();
    location.reload();
}