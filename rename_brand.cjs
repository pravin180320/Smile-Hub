const fs = require('fs');

const files = ['index.html', 'about.html', 'services.html', 'clinic.html', 'contact.html'];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    content = content.replace(/LUMINE DENTAL/g, 'The Smile Hub');
    content = content.replace(/Lumine Dental Clinic/g, 'The Smile Hub');
    content = content.replace(/Lumine Dental/g, 'The Smile Hub');
    
    content = content.replace(/LUMINE/g, 'The Smile Hub');
    content = content.replace(/Lumine/g, 'The Smile Hub');
    
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
});
