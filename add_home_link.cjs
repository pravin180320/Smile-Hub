const fs = require('fs');

const files = ['about.html', 'services.html', 'clinic.html', 'contact.html'];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Match the flex container for the desktop navigation
    const navRegex = /(<div class="hidden md:flex items-center space-x-\d+">)/;
    
    // We'll insert the Home link. First let's check if it's already there to prevent duplicates
    if (!content.match(/href="\/"[^>]*>Home<\/a>/)) {
        const homeLink = `\n<a class="font-label-md text-label-md uppercase tracking-widest text-on-surface hover:text-gold-standard transition-colors duration-300" href="/">Home</a>`;
        content = content.replace(navRegex, `$1${homeLink}`);
        fs.writeFileSync(file, content);
        console.log(`Added Home to ${file}`);
    } else {
        console.log(`Home already in ${file}`);
    }
});
