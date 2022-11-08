let darkMode = localStorage.getItem('darkMode');
const darkModeToggle = document.querySelector('dark-mode-toggle');

const enableDarkMode = () => {
    document.body.classList.add('darkmode');
    localStorage.setItem('darkMode','enabled');

};

const disableDarkMode = () => {
    document.body.classList.remove('darkmode');
    localStorage.setItem('darkMode','disable');

};

darkModeToggle.addEventListener('click',()=>{
    if (darkMode !== 'enabled'){
        enableDarkMode();
    }
    
});