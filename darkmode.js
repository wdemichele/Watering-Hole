let darkMode = localStorage.getItem('darkMode');
const darkModeToggle = document.querySelector('dark-mode-toggle');

darkModeToggle.addEventListener("click",()=>{
    console.log('test');
});

const enableDarkMode = () => {
    document.body.classList.add('darkmode');
    localStorage.setItem('darkMode','enabled');

};

const disableDarkMode = () => {
    document.body.classList.remove('darkmode');
    localStorage.setItem('darkMode','disabled');

};

darkModeToggle.addEventListener('click',()=>{
    if (darkMode !== 'enabled'){
        enableDarkMode();
    }
    
});